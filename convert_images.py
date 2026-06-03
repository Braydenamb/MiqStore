import os
import glob
from PIL import Image

def convert_to_webp():
    target_dir = "public/images"
    patterns = [os.path.join(target_dir, "*.jpg"), os.path.join(target_dir, "*.jpeg"), os.path.join(target_dir, "*.png")]
    files = []
    for pattern in patterns:
        files.extend(glob.glob(pattern))
    
    for file_path in files:
        if file_path.endswith('.webp'):
            continue
            
        try:
            img = Image.open(file_path)
            # WebP usually supports RGBA, but just in case, save it correctly
            new_path = os.path.splitext(file_path)[0] + ".webp"
            img.save(new_path, "webp", quality=80)
            print(f"Converted {file_path} to {new_path}")
            
            # Delete original
            os.remove(file_path)
            print(f"Deleted original {file_path}")
            
        except Exception as e:
            print(f"Error converting {file_path}: {e}")

if __name__ == "__main__":
    convert_to_webp()
