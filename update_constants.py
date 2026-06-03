import re

file_path = "src/lib/constants.ts"

with open(file_path, "r") as f:
    content = f.read()

# Replace all .jpg and .png in /images/ with .webp
content = re.sub(r'(/images/[\w-]+)\.(?:jpg|png)', r'\1.webp', content)

with open(file_path, "w") as f:
    f.write(content)
print("Updated constants.ts")
