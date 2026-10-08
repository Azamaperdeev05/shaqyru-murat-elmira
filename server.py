import http.server
import socketserver
import os
import json
import urllib.parse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class ShaqyruHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path.endswith('zayavka2.php'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            parsed = urllib.parse.parse_qs(post_data)
            
            rejim = parsed.get('rejim', [''])[0]
            name = parsed.get('name', [''])[0]
            zhauap = parsed.get('zhauap', [''])[0]
            tilek = parsed.get('tilek', [''])[0]

            print(f"[ZAYAVKA] Rejim: {rejim}, Name: {name}, Zhauap: {zhauap}, Tilek: {tilek}")

            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            if rejim == '1':
                self.wfile.write((name or '1').encode('utf-8'))
            elif rejim == '2':
                self.wfile.write((name or 'Қонақ').encode('utf-8'))
            else:
                self.wfile.write(b'success')
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), ShaqyruHandler) as httpd:
        print(f"Шақыру сайты қосылды: http://localhost:{PORT}")
        print("Тоқтату үшін Ctrl+C басыңыз.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер тоқтатылды.")
