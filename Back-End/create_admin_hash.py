import bcrypt
import sys

def generate_hash(password):
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_admin_hash.py <your_password>")
    else:
        print(f"Hashed Password: {generate_hash(sys.argv[1])}")
