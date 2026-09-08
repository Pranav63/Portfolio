import Link from 'next/link';

export default function PageFooter() {
  return <footer className="page-footer page-shell"><span>© {new Date().getFullYear()} Pranav Arora · Abu Dhabi</span><div><Link href="/#projects">Selected work</Link><Link href="/#contact">Get in touch ↗</Link></div></footer>;
}
