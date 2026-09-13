BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
BASE = len(BASE62_ALPHABET)

MULTIPLIER = 2654435769
MASK = 0xFFFFFFFF


def obfuscate_id(num: int) -> int:
    """
    Obfuscates an auto-increment integer ID into a non-sequential, unique 32-bit integer.
    Uses Knuth's multiplicative hashing with bit mixing to maintain 1-to-1 bijection.
    """
    val = (num + 100000) & MASK
    val = (val * MULTIPLIER) & MASK
    val ^= (val >> 16)
    return val


def encode_base62(num: int) -> str:
    """Encodes a positive integer into a Base62 string."""
    if num == 0:
        return BASE62_ALPHABET[0]

    arr = []
    while num > 0:
        num, rem = divmod(num, BASE)
        arr.append(BASE62_ALPHABET[rem])

    arr.reverse()
    return "".join(arr)


def decode_base62(code: str) -> int:
    """Decodes a Base62 string back into an integer."""
    num = 0
    for char in code:
        num = num * BASE + BASE62_ALPHABET.index(char)
    return num


def generate_short_code_from_id(url_id: int) -> str:
    """Generates a unique, non-sequential Base62 short code from a database integer ID."""
    scrambled = obfuscate_id(url_id)
    return encode_base62(scrambled)
