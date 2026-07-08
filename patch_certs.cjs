const fs = require('fs');

let types = fs.readFileSync('src/types.ts', 'utf8');
const certType = `  certificates?: {
    certificateId: string;
    courseId: string;
    courseTitle: string;
    studentName: string;
    issuedAt: string;
  }[];
`;
types = types.replace(certType, '');
fs.writeFileSync('src/types.ts', types);

let models = fs.readFileSync('src/db/models.ts', 'utf8');
const modelInterface = `  certificates: {
    certificateId: string;
    courseId: string;
    courseTitle: string;
    studentName: string;
    issuedAt: Date;
  }[];
`;
models = models.replace(modelInterface, '');

const schemaCert = `  certificates: [{
    certificateId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    studentName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now }
  }],
`;
models = models.replace(schemaCert, '');
fs.writeFileSync('src/db/models.ts', models);
console.log('patched');
