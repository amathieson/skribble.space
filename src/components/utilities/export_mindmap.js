// exportSvgToPdf.js

export const exportSvgToPdf = () => {

    let x = 0; 
    let y = 0;
    let w = 0;
    let h = 0;

    const svg = document.getElementById('vector');
    if (!svg) {
        alert('SVG map not found!');
        return;
    }

    const rectToPdfCommands = (rect) => {
        x = parseFloat(rect.getAttribute('x') || 0);
        y = parseFloat(rect.getAttribute('y') || 0);
        w = parseFloat(rect.getAttribute('width') || 0);
        h = parseFloat(rect.getAttribute('height') || 0);


        return `${x} ${y} m
${x + w} ${y} l
${x + w} ${y + h} l
${x} ${y + h} l
h
S`;
    };

    const parseSvgPathToPdfCommands = (d) => {
        
        
        let cmds = [];
        const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+/g);
        let i = 0;
        while (i < tokens.length) {
            const cmd = tokens[i++];
            if (cmd === 'M') {
                const x = tokens[i++];
                const y = tokens[i++];
                cmds.push(`${x} ${y} m`);
            } else if (cmd === 'L') {
                const x = tokens[i++];
                const y = tokens[i++];
                cmds.push(`${x} ${y} l`);
            } else if (cmd === 'C') {
                const x1 = tokens[i++];
                const y1 = tokens[i++];
                const x2 = tokens[i++];
                const y2 = tokens[i++];
                const x3 = tokens[i++];
                const y3 = tokens[i++];
                cmds.push(`${x1} ${y1} ${x2} ${y2} ${x3} ${y3} c`);
            } else if (cmd === 'Z' || cmd === 'z') {
                cmds.push('h');
            }
        }
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

        return pdf;
    };

    const pdfString = buildPdf(contentStream);

    const blob = new Blob([pdfString], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map_export.pdf';
    a.click();
    URL.revokeObjectURL(url);
};
