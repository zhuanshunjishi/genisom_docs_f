#!/usr/bin/env python3
"""Build the standalone Genisom SDK documentation index."""

import argparse
import hashlib
from pathlib import Path

PACKAGE = Path(__file__).resolve().parent
INDEX_PATH = PACKAGE / "skills/genisom-sdk/references/llms.txt"
DEFAULT_SITE = "https://zsibot.github.io/genisom_docs"
QUICKSTART = {
    "l1": "08-sdk-development-guide.md",
    "m1": "04-sdk-quickstart.md",
    "l2": "06-sdk-quickstart.md",
}
SDK_CHAPTERS = {
    "l1": ("06-", "07-", "09-"),
    "m1": ("05-", "06-", "07-", "08-", "sdk-", "video-"),
    "l2": ("07-", "08-", "09-", "10-"),
}


def build_index(source, site):
    lines = [
        "# Genisom AI Robot SDK",
        "",
        "> SDK guides and API references for Genisom L1, Genisom M1, and Genisom L2.",
        "",
        "Source paths are relative to the documentation checkout or Markdown export.",
    ]
    digest = hashlib.sha256()
    export_pages = []
    for product, language, folder in (
        ("l1", "中文", "l1"),
        ("l1", "English", "l1-en"),
        ("m1", "中文", "m1"),
        ("m1", "English", "m1-en"),
        ("l2", "中文", "l2"),
    ):
        root = source / folder
        quickstart = root / "md" / QUICKSTART[product]
        pages = sorted((root / "md").glob("*.md"))
        if not quickstart.is_file():
            raise ValueError(f"Missing SDK quickstart: {quickstart}")
        export_pages.extend([root / "index.md", *pages])
        sdk_pages = [
            path for path in pages if path.name.startswith(SDK_CHAPTERS[product])
        ]
        lines.extend(["", f"## Genisom {product.upper()} ({language})", ""])
        for path in (quickstart, *sdk_pages):
            relative = path.relative_to(source)
            data = path.read_bytes()
            title_line = data.decode("utf-8").splitlines()[0]
            if not title_line.startswith("# "):
                raise ValueError(f"Expected a level-one title: {path}")
            digest.update(relative.as_posix().encode("utf-8") + b"\0" + data + b"\0")
            url = f"{site}/{relative.with_suffix('.html').as_posix()}"
            title = title_line[2:].strip()
            lines.append(f"- [{title}]({url}): `{relative.as_posix()}`")

    lines.extend(["", f"Indexed SDK Markdown revision (SHA-256): `{digest.hexdigest()}`"])
    return "\n".join(lines) + "\n", export_pages


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=PACKAGE.parent)
    parser.add_argument("--site", default=DEFAULT_SITE, help="Published docs base URL")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="Check the bundled index")
    mode.add_argument("--export", type=Path, help="Write Markdown to a new directory")
    args = parser.parse_args()

    try:
        index, pages = build_index(args.source, args.site.rstrip("/"))
        if args.check:
            if INDEX_PATH.read_text(encoding="utf-8") != index:
                parser.exit(1, "Index is out of date. Run build_index.py to refresh it.\n")
        elif args.export:
            # Keep original relative paths so links between Markdown pages resolve.
            files = [(page.relative_to(args.source), page.read_bytes()) for page in pages]
            args.export.mkdir(parents=True, exist_ok=False)
            for relative, data in files:
                target = args.export / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
            (args.export / "llms.txt").write_text(index, encoding="utf-8")
        else:
            INDEX_PATH.write_text(index, encoding="utf-8")
    except (OSError, ValueError, IndexError) as error:
        parser.exit(1, f"{error}\n")


if __name__ == "__main__":
    main()
