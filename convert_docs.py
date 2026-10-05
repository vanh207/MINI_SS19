import sys, os, zipfile, xml.etree.ElementTree as ET
sys.stdout.reconfigure(encoding='utf-8')

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def docx_to_md(docx_path):
    with zipfile.ZipFile(docx_path) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        body = tree.find('w:body', ns)
        out = []
        for child in body:
            tag = child.tag.split('}')[-1]
            if tag == 'p':
                pStyle = child.find('.//w:pStyle', ns)
                style_val = pStyle.attrib.get(f'{{{ns["w"]}}}val', '') if pStyle is not None else ''
                text = ''.join(n.text for n in child.iterfind('.//w:t', ns) if n.text).strip()
                if not text:
                    continue
                if 'Heading1' in style_val or style_val == '1':
                    out.append(f'# {text}\n')
                elif 'Heading2' in style_val or style_val == '2':
                    out.append(f'## {text}\n')
                elif 'Heading3' in style_val or style_val == '3':
                    out.append(f'### {text}\n')
                else:
                    out.append(f'{text}\n')
            elif tag == 'tbl':
                rows = []
                for tr in child.findall('.//w:tr', ns):
                    cells = []
                    for tc in tr.findall('.//w:tc', ns):
                        cell_text = ' '.join(''.join(t.text for t in p.iterfind('.//w:t', ns) if t.text).strip() for p in tc.findall('.//w:p', ns)).strip()
                        cells.append(cell_text.replace('|', '/'))
                    rows.append(cells)
                if rows:
                    max_cols = max(len(r) for r in rows)
                    for r in rows:
                        while len(r) < max_cols:
                            r.append('')
                    header = rows[0]
                    out.append('| ' + ' | '.join(header) + ' |')
                    out.append('| ' + ' | '.join(['---'] * max_cols) + ' |')
                    for r in rows[1:]:
                        out.append('| ' + ' | '.join(r) + ' |')
                    out.append('\n')
        return '\n'.join(out)

for doc in ['Session_19_SRS.docx', '[Mini Project] Hệ thống Quản lý Bán lẻ Đa kênh FastMart-Enterprise.docx']:
    md = docx_to_md(doc)
    out_name = doc.replace('.docx', '.md')
    with open(out_name, 'w', encoding='utf-8') as f:
        f.write(md)
    print(f'Converted {doc} -> {out_name} ({len(md)} chars)')
