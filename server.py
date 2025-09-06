#!/usr/bin/env python3
import http.server
import socketserver
import sys
import os

# Change to the webapp directory
os.chdir('/home/user/webapp')

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHandler) as httpd:
        print(f"🚀 Neural Code Nexus server starting on port {PORT}")
        print(f"📁 Serving directory: {os.getcwd()}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")
            httpd.shutdown()