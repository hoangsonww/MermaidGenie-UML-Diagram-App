// src/components/Footer.tsx
import Link from "next/link";
import { Github, Heart, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-8 gap-4 text-sm text-muted-foreground">
        {/* Credit */}
        <p className="flex flex-col sm:flex-row sm:items-center gap-1 text-center">
          <span className="flex items-center gap-1">
            Made with <Heart size={14} className="text-destructive" /> by{" "}
            <Link href="/" className="font-medium hover:text-primary">
              MermaidGenie
            </Link>
          </span>
          <span>
            · Created by{" "}
            <Link
              href="https://sonnguyenhoang.com"
              target="_blank"
              className="font-medium underline hover:text-primary"
            >
              Son Nguyen
            </Link>{" "}
            in 2025
          </span>
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <Github size={16} /> Source on GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/hoangsonw"
            target="_blank"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <Linkedin size={16} /> Reach out on LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
