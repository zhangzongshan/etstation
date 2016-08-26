using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace EtsationApi.Controllers
{
    [RoutePrefix("api")]
    public class ImagesController : ApiController
    {
        [HttpGet]
        [Route("Images")]
        public async Task<HttpResponseMessage> GetImage()
        {
            string img= HttpContext.Current.Request.QueryString["img"];
            HttpResponseMessage response = new HttpResponseMessage();

            var imgPath = HttpContext.Current.Server.MapPath("~/App_Data/"+ img);

            var contentType = MimeMapping.GetMimeMapping(imgPath);

            string ext = Path.GetExtension(imgPath).Replace(".", "");
            
            //从图片中读取byte  
            //var imgByte = File.ReadAllBytes(imgPath);
            //从图片中读取流  

            if (contentType.Contains("image"))
            {
                var imgStream = new MemoryStream(File.ReadAllBytes(imgPath));
                response.Content = new StreamContent(imgStream);
                response.Content.Headers.ContentType  = new MediaTypeHeaderValue("image/" + ext);
            }
            else
            {
                var stream = new FileStream(imgPath, FileMode.Open, FileAccess.Read);
                response.Content = new ByteRangeStreamContent(stream, Request.Headers.Range, new MediaTypeHeaderValue("video/" + ext));
            }
            response.StatusCode = HttpStatusCode.OK;
            
            return response;

        }
        [HttpGet]
        [Route("Video")]
        public async Task<HttpResponseMessage> GetVideo()
        {
            string img = HttpContext.Current.Request.QueryString["img"];
            HttpResponseMessage response = new HttpResponseMessage();
            var imgPath = HttpContext.Current.Server.MapPath("~/App_Data/" + img);

            string ext = Path.GetExtension(imgPath).Replace(".", "");

            //HttpBrowserCapabilities bc = HttpContext.Current.Request.Browser;

            FileInfo fileInfo = new FileInfo(imgPath);
            long totalLength = fileInfo.Length;

            RangeHeaderValue rangeHeader = base.Request.Headers.Range;
            response.Headers.AcceptRanges.Add("bytes");

            if (rangeHeader == null || !rangeHeader.Ranges.Any())
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Content = new PushStreamContent((outputStream, httpContent, transpContext)
                =>
                {
                    using (outputStream) // Copy the file to output stream straightforward. 
                    using (Stream inputStream = fileInfo.OpenRead())
                    {
                        try
                        {
                            inputStream.CopyTo(outputStream, ReadStreamBufferSize);
                        }
                        catch (Exception error)
                        {
                            System.Diagnostics.Debug.WriteLine(error);
                        }
                    }
                }, new MediaTypeHeaderValue("video/" + ext));

                response.Content.Headers.ContentLength = totalLength;
                return response;
            }

            long start = 0, end = 0;

            if (rangeHeader.Unit != "bytes" || rangeHeader.Ranges.Count > 1 ||!TryReadRangeItem(rangeHeader.Ranges.First(), totalLength, out start, out end))
            {
                response.StatusCode = HttpStatusCode.RequestedRangeNotSatisfiable;
                response.Content = new StreamContent(Stream.Null);  // No content for this status.
                response.Content.Headers.ContentRange = new ContentRangeHeaderValue(totalLength);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("video/" + ext);

                return response;
            }

            var contentRange = new ContentRangeHeaderValue(start, end, totalLength);

            // We are now ready to produce partial content.
            response.StatusCode = HttpStatusCode.PartialContent;
            response.Content = new PushStreamContent((outputStream, httpContent, transpContext)
            =>
            {
                using (outputStream) // Copy the file to output stream in indicated range.
                using (Stream inputStream = fileInfo.OpenRead())
                    CreatePartialContent(inputStream, outputStream, start, end);

            }, new MediaTypeHeaderValue("video/" + ext));

            response.Content.Headers.ContentLength = end - start + 1;
            response.Content.Headers.ContentRange = contentRange;

            return response;

            //var stream = new FileStream(imgPath, FileMode.Open, FileAccess.Read);
            //response.Content = new ByteRangeStreamContent(stream, Request.Headers.Range, new MediaTypeHeaderValue("video/" + ext));
            
            //return response;
        }
        public const int ReadStreamBufferSize = 1024 * 1024;
        private static void CreatePartialContent(Stream inputStream, Stream outputStream,
            long start, long end)
        {
            int count = 0;
            long remainingBytes = end - start + 1;
            long position = start;
            byte[] buffer = new byte[ReadStreamBufferSize];

            inputStream.Position = start;
            do
            {
                try
                {
                    if (remainingBytes > ReadStreamBufferSize)
                        count = inputStream.Read(buffer, 0, ReadStreamBufferSize);
                    else
                        count = inputStream.Read(buffer, 0, (int)remainingBytes);
                    outputStream.Write(buffer, 0, count);
                }
                catch (Exception error)
                {
                    Debug.WriteLine(error);
                    break;
                }
                position = inputStream.Position;
                remainingBytes = end - position + 1;
            } while (position <= end);
        }

        private static bool TryReadRangeItem(RangeItemHeaderValue range, long contentLength,
            out long start, out long end)
        {
            if (range.From != null)
            {
                start = range.From.Value;
                if (range.To != null)
                    end = range.To.Value;
                else
                    end = contentLength - 1;
            }
            else
            {
                end = contentLength - 1;
                if (range.To != null)
                    start = contentLength - range.To.Value;
                else
                    start = 0;
            }
            return (start < contentLength && end < contentLength);
        }

        private byte[] CompressionImage(Stream fileStream, long quality)
        {
            using (System.Drawing.Image img = System.Drawing.Image.FromStream(fileStream))
            {
                using (Bitmap bitmap = new Bitmap(img))
                {
                    ImageCodecInfo CodecInfo = GetEncoder(img.RawFormat);
                    Encoder myEncoder = Encoder.Quality;
                    EncoderParameters myEncoderParameters = new EncoderParameters(1);
                    EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, quality);
                    myEncoderParameters.Param[0] = myEncoderParameter;
                    using (MemoryStream ms = new MemoryStream())
                    {
                        bitmap.Save(ms, CodecInfo, myEncoderParameters);
                        myEncoderParameters.Dispose();
                        myEncoderParameter.Dispose();
                        return ms.ToArray();
                    }
                }
            }
        }

        private static ImageCodecInfo GetEncoderInfo(String mimeType)
        {
            int j;
            ImageCodecInfo[] encoders;
            encoders = ImageCodecInfo.GetImageEncoders();
            for (j = 0; j < encoders.Length; ++j)
            {
                if (encoders[j].MimeType == mimeType)
                    return encoders[j];
            }
            return null;
        }

        private static ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
    }

}
