use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Request, Response, Server, StatusCode};
use std::convert::Infallible;
use std::fs;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};

/// Return the appropriate MIME type for a given file path extension
fn mime_type_from_ext(path: &Path) -> &'static str {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("html") => "text/html; charset=utf-8",
        Some("js") | Some("jsx") => "text/javascript; charset=utf-8", // or "application/javascript"
        Some("css") => "text/css; charset=utf-8",
        Some("json") => "application/json; charset=utf-8",
        Some("png") => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("gif") => "image/gif",
        _ => "application/octet-stream",
    }
}

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    // Figure out the path being requested
    let uri_path = req.uri().path();

    // If request is just "/", serve the index.html from dist
    if uri_path == "/" {
        // Adjust this path to wherever your index.html is actually located
        let path = Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("build")
            .join("dist")
            .join("index.html");
        match fs::read_to_string(&path) {
            Ok(content) => {
                // Return with "Content-Type: text/html"
                Ok(Response::builder()
                    .header("Content-Type", "text/html; charset=utf-8")
                    .body(Body::from(content))
                    .unwrap())
            }
            Err(_) => Ok(Response::builder()
                .status(StatusCode::NOT_FOUND)
                .body(Body::from("Index file not found."))
                .unwrap()),
        }
    } else {
        // Otherwise, treat the path as a request for a static file in the same folder.
        // For example, GET /assets/index-sreDOSsp.js
        // Adjust your "dist" folder path if needed:
        let mut file_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        file_path.push("build");
        file_path.push("dist");

        // Remove leading '/' so it doesn't break PathBuf's normal behavior
        // e.g. "/assets/index-sreDOSsp.js" => "assets/index-sreDOSsp.js"
        let fixed_uri_path = uri_path.trim_start_matches('/');

        file_path.push(fixed_uri_path);

        match fs::read(&file_path) {
            Ok(bytes) => {
                // Identify MIME type based on the file extension
                let mime = mime_type_from_ext(&file_path);
                Ok(Response::builder()
                    .header("Content-Type", mime)
                    .body(Body::from(bytes))
                    .unwrap())
            }
            Err(_) => {
                // If we can’t read the file, return 404
                Ok(Response::builder()
                    .status(StatusCode::NOT_FOUND)
                    .body(Body::from(format!("File not found: {}", uri_path)))
                    .unwrap())
            }
        }
    }
}

#[tokio::main]
async fn main() {
    // Listen on localhost, port 3000
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    // Create a service that uses handle_request
    let make_svc =
        make_service_fn(|_conn| async { Ok::<_, Infallible>(service_fn(handle_request)) });

    let server = Server::bind(&addr).serve(make_svc);

    println!("Listening on http://{}", addr);

    // Run the server
    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}
