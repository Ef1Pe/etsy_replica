"""Flask server for the Etsy replica experience."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

from flask import Flask, abort, send_from_directory

BASE_DIR = Path(__file__).parent
STATIC_DIRS = {
    "css": BASE_DIR / "css",
    "js": BASE_DIR / "js",
    "images": BASE_DIR / "images",
    "data": BASE_DIR / "data",
}

injected_content: List[Dict] = []


def build_content_card(item: Dict) -> str:
    """Return HTML for a single injected product card."""

    badge_html = (
        f'<span class="text-[#17846c] font-semibold">{item.get("badge")}</span>'
        if item.get("badge")
        else ""
    )
    rating = item.get("rating")
    reviews = item.get("reviews")
    rating_html = (
        f'<div class="text-xs text-[#5c5c5c]">{rating} ★ · {reviews} reviews</div>'
        if rating and reviews
        else ""
    )

    return f"""
        <!-- INJECTED CONTENT -->
        <article class="product-card injected">
            <img src="{item.get('image_url', '')}" alt="{item.get('product_name') or item.get('title', 'Injected product')}" />
            <h3>{item.get('product_name') or item.get('title', 'New find')}</h3>
            <p>{item.get('description', '')}</p>
            <div class="flex items-center justify-between text-sm">
                <span class="font-semibold">${item.get('price', '0.00')}</span>
                {badge_html}
            </div>
            {rating_html}
        </article>
    """


def inject_content_into_html(html_content: str, item: Dict) -> str:
    """Inject item HTML into the requested selector container."""

    selector = item.get("selector") or "[data-injection='product-grid']"
    marker = selector.replace("[", "").replace("]", "")
    attr_name, attr_value = marker.split("=") if "=" in marker else ("data-injection", "product-grid")
    attr_value = attr_value.strip("'\"")
    needle_single = f"{attr_name}='{attr_value}'"
    needle_double = f'{attr_name}="{attr_value}"'

    marker_index = html_content.find(needle_single)
    if marker_index == -1:
        marker_index = html_content.find(needle_double)
    if marker_index == -1:
        return html_content

    insert_pos = html_content.find(">", marker_index) + 1
    if insert_pos <= 0:
        return html_content

    card_html = build_content_card(item)
    return html_content[:insert_pos] + card_html + html_content[insert_pos:]


def load_html_page(page_name: str) -> str:
    """Read an HTML file from disk."""

    html_path = BASE_DIR / f"{page_name}.html"
    if not html_path.exists():
        abort(404)
    return html_path.read_text(encoding="utf-8")


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)

    @app.route("/")
    @app.route("/index.html")
    def index():
        html = load_html_page("index")
        for item in injected_content:
            if item.get("section") in (None, "index"):
                html = inject_content_into_html(html, item)
        return html

    @app.route("/<page>.html")
    def serve_page(page: str):
        html = load_html_page(page)
        for item in injected_content:
            if item.get("section") == page:
                html = inject_content_into_html(html, item)
        return html

    for prefix, directory in STATIC_DIRS.items():
        directory.mkdir(exist_ok=True)

        def register_static_route(route_prefix: str, static_dir: Path) -> None:
            endpoint_name = f"serve_{route_prefix}"

            @app.route(f"/{route_prefix}/<path:filename>", endpoint=endpoint_name)
            def _serve_static(filename: str, _dir: Path = static_dir):  # type: ignore
                return send_from_directory(_dir, filename)

        register_static_route(prefix, directory)

    @app.route("/api/content")
    def get_content():
        return {"content": injected_content, "count": len(injected_content)}

    return app


def start_server(port: int = 5000, threaded: bool = False, content_data: Dict | None = None):
    """Start the Flask development server with optional injected data."""

    if content_data:
        injected_content.append(content_data)

    app = create_app()
    from agenticverse_entities.base.server_base import start_server as start_base_server

    return start_base_server(app, port=port, threaded=threaded)
