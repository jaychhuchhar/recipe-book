export function YouTube({ id, title }: { id: string; title?: string }) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const embed = `https://www.youtube.com/embed/${id}`;

  return (
    <div className="my-4">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}

      <p className="text-sm text-muted-foreground mb-2">
        Original YouTube Video:{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Watch on YouTube
        </a>{" "}
        or here:
      </p>

      <div className="w-full aspect-video">
        <iframe
          className="w-full h-full"
          src={embed}
          title={title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
