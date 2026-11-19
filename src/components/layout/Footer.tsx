import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <span>© 2026 ApexOps Portal. All rights reserved.</span>
        <div className="footer-links">
          <span className="flex items-center gap-1">
            <span className="tiny-dot" />
            System operational
          </span>
          <Button variant="link" className="p-0 h-auto text-xs">
            Help &amp; Support
          </Button>
          <span>Version 1.0</span>
        </div>
      </div>
    </footer>
  );
}
