import re

with open('src/components/PublicHome.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const cObj = typeof post.course === "object" ? post.course : courses.find(c => c._id === post.course);',
    'const cObj = typeof post.course === "object" ? post.course : courses.find(c => c._id === (post.course as string));'
)

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)
