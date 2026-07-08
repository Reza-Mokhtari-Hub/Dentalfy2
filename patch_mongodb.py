import re

with open('src/db/mongodb.ts', 'r') as f:
    content = f.read()

# Remove top-level MONGODB_URI
content = re.sub(r'const MONGODB_URI = process\.env\.MONGODB_URI \|\| "";\n', '', content)
content = re.sub(r'if \(\!MONGODB_URI\) \{\n\s*console\.warn\(".*?MONGODB_URI is not defined.*?"\);\n\}\n', '', content)

# Insert it inside connectToDatabase
new_func = '''export async function connectToDatabase(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI || "";
  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not defined in environment variables. Database connections will fail.");
    throw new Error("MONGODB_URI missing");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("🔌 Connected to MongoDB successfully (Pooled Connection).");
      return mongooseInstance;
    });
  }'''

content = re.sub(r'export async function connectToDatabase\(\): Promise<typeof mongoose> \{\n\s*if \(cached\.conn\) \{\n\s*return cached\.conn;\n\s*\}\n\s*if \(\!cached\.promise\) \{\n\s*const opts = \{\n\s*bufferCommands: false,\n\s*\};\n\s*cached\.promise = mongoose\.connect\(MONGODB_URI, opts\)\.then\(\(mongooseInstance\) => \{\n\s*console\.log\("🔌 Connected to MongoDB successfully \(Pooled Connection\)\."\);\n\s*return mongooseInstance;\n\s*\}\);\n\s*\}', new_func, content)

with open('src/db/mongodb.ts', 'w') as f:
    f.write(content)
