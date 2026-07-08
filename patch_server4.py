import re

with open('server.ts', 'r') as f:
    content = f.read()

# I will find the first useCloudinary block and remove the second one.
# Notice lines 15 to 40 roughly are duplicate

parts = content.split('  const useCloudinary = !!(')
if len(parts) > 2:
    # There are two useCloudinary blocks!
    # Let's rebuild the file manually, just removing the duplicate block
    pass

