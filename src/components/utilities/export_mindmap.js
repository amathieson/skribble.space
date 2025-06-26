/**
 * Exports an SVG element to a PDF file.
 * The SVG element with the ID 'vector' is parsed into PDF commands
 * and saved as a downloadable PDF file.
 * 
 * @throws Will alert the user if the SVG element with ID 'vector' is not found.
 * @throws
 */
export const exportSvgToPdf = () => {

    //Coords
    let x = 0; 
    let y = 0;
    let w = 0;
    let h = 0;

    // Flip the Y coordinate for a PDF coordinate system
    let flipY = 0;
    
    //Gets the SVG
    const svg = document.getElementById('vector');
    
    //TODO: improve user feedback when we have notis of some kind
    if (!svg) {
        alert('SVG map not found!');
        return;
    }

    /**
     * Converts the background rect to PDF commands
     * 
     * Uses the size, etc., of the Vector element to determine the size of the PDF
     * @param rect
     * @returns {`${number} ${*} m
     ${number} ${*} l
     ${number} ${*} l
     ${number} ${*} l
     h
     S`}
     */
    const rectToPdfCommands = (rect) => {
        x = parseFloat(rect.getAttribute('x') || 0);
        y = parseFloat(rect.getAttribute('y') || 0);
        w = parseFloat(rect.getAttribute('width') || 0);
        h = parseFloat(rect.getAttribute('height') || 0);
        
        flipY = (y) => h - y;
        
        return `${x} ${flipY(y)} m
${x + w} ${flipY(y)} l
${x + w} ${flipY(y + h)} l
${x} ${flipY(y + h)} l
h
S`;
    };

    /**
     * Converts the SVG path to PDF commands
     * @param d
     * @returns {string}
     */
    const parseSvgPathToPdfCommands = (d) => {
        
        
        let cmds = [];
        const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
        let i = 0;
        while (i < tokens.length) {
            const cmd = tokens[i++];
            switch (cmd) {
                case 'M': {
                    const x = tokens[i++];
                    const y = tokens[i++];
                    cmds.push(`${x} ${flipY(y)} m`);
                    break;
                }
                case 'L': {
                    const x = tokens[i++];
                    const y = tokens[i++];
                    cmds.push(`${x} ${flipY(y)} l`);
                    break;
                }
                case 'C': {
                    const x1 = tokens[i++];
                    const y1 = tokens[i++];
                    const x2 = tokens[i++];
                    const y2 = tokens[i++];
                    const x3 = tokens[i++];
                    const y3 = tokens[i++];
                    cmds.push(`${x1} ${flipY(y1)} ${x2} ${flipY(y2)} ${x3} ${flipY(y3)} c`);
                    break;
                }
                case 'Z':
                case 'z': {
                    cmds.push('h');
                    break;
                }
        }}
        cmds.push('S');
        return cmds.join('\n');
    };

    let contentStream = '';

    const rect = svg.querySelector('rect');
    if (rect) {
        contentStream += rectToPdfCommands(rect) + '\n';
    }

    const paths = svg.querySelectorAll('g path');
    paths.forEach(path => {
        const d = path.getAttribute('d');
        contentStream += parseSvgPathToPdfCommands(d) + '\n';
    });

    /**
     * Generates a basic PDF document as a string using a provided content stream.
     *
     * This function creates a minimal PDF structure, including catalogue, pages, and content
     * objects. The generated PDF content is returned as a single string.
     *
     * @param {string} contentStream - The content stream to include in the PDF document. It
     * should be plain text representing the contents of the PDF.
     * @returns {string} The PDF document as a string, adhering to the PDF 1.4 specification.
     */
    const buildPdf = (contentStream) => {
        let objects = [];
        let offsets = [];
        let currentOffset = 0;

        const addObject = (obj) => {
            offsets.push(currentOffset);
            let objString = obj + '\n';
            currentOffset += objString.length;
            objects.push(objString);
            return offsets.length;
        };

        /**
         * YOUR IDE WILL COMPLAIN THESE ARE NOT IN USE, BUT THEY ARE NEEDED FOR THE PDF TO WORK
         * @type {number}
         */
        /* eslint-disable */
        const catalogObjNum = addObject(`1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj`);

        const pagesObjNum = addObject(`2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj`);

        const pageObjNum = addObject(`3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 4 0 R >>
endobj`);

        const encoder = new TextEncoder();
        const contentBytes = encoder.encode(contentStream);
        const contentLength = contentBytes.length;

        const contentObjNum = addObject(`4 0 obj
<< /Length ${contentLength} >>
stream
${contentStream}
endstream
endobj`);

        let xrefOffset = currentOffset;
        let xref = 'xref\n0 ' + (offsets.length + 1) + '\n';
        xref += '0000000000 65535 f \n';
        offsets.forEach(offset => {
            xref += offset.toString().padStart(10, '0') + ' 00000 n \n';
        });

        let trailer = `trailer
<< /Size ${offsets.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

        let pdf = `%PDF-1.4
`;
        pdf += objects.join('');
        pdf += xref;
        pdf += trailer;
        
        /* eslint-enable */
        return pdf;
    };

    const pdfString = buildPdf(contentStream);

    const blob = new Blob([pdfString], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    //TODO: when we can name the mindmaps, update file name to be the name of the mindmap
    a.download = 'map_export.pdf';
    a.click();
    URL.revokeObjectURL(url);
};
