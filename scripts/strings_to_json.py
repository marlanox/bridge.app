import re, json, sys

def parse_strings(path):
    with open(path, encoding='utf-8') as f:
        text = f.read()
    # Match "key" = "value"; possibly spanning content with escaped quotes
    pattern = re.compile(r'"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;', re.DOTALL)
    result = {}
    for m in pattern.finditer(text):
        key = m.group(1)
        val = m.group(2)
        def unescape(s):
            return s.replace('\\"', '"').replace('\\n', '\n').replace('\\\\', '\\')
        result[unescape(key)] = unescape(val)
    return result

en = parse_strings('/home/user/bridge.app/Bridge/Resources/en.lproj/Localizable.strings')
ru = parse_strings('/home/user/bridge.app/Bridge/Resources/ru.lproj/Localizable.strings')

print(f"EN keys: {len(en)}  RU keys: {len(ru)}", file=sys.stderr)

with open('/home/user/bridge.app/shared-spec/strings.en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, ensure_ascii=False, indent=2, sort_keys=True)
with open('/home/user/bridge.app/shared-spec/strings.ru.json', 'w', encoding='utf-8') as f:
    json.dump(ru, f, ensure_ascii=False, indent=2, sort_keys=True)
