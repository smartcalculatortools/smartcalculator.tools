export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-bg p-4">{children}</div>;
}
