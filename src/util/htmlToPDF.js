
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.exportPDF = function (className,title) {
      // console.log($(`.${className}`)[0].outerHTML)
      html2Canvas($(`.${className}`)[0], {
        // dpi: 144,
        scale: 2.5,
        allowTaint: false,
        useCORS: true,
      }).then(function (canvas) {
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          let pageHeight = contentWidth / 592.28 * 841.89;
          let leftHeight = contentHeight;
          let position = 0;
          let imgWidth = 595.28;
          let imgHeight = 592.28 / contentWidth * contentHeight;

          let context = canvas.getContext('2d');
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;

          let pageData = canvas.toDataURL('image/jpeg', 1.0);
          let PDF = new JsPDF('', 'pt', 'a4');
        // PDF.fromHTML( '<div>aaa<h1>1243424</h1></div><p>xxxxxxxxxxxxxaaaa</p><a href="http://www.google.com">Click Here</a>', 35, 25,);
        // PDF.textWithLink('Click here',  35, 765, { x: 35,y: 25,  });
        // PDF.fromHTML( $(`.${className}`)[0].outerHTML, 35, 25,);
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) { PDF.addPage() }
            }
          }
          PDF.save(title + '.pdf')

        }
      )
    }
  }
}
