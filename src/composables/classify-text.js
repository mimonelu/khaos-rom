const protocol  = "https?:\\/\\/"
const something = "[^\\s\\(\\)\\[\\]]"

const pattern = {
  url  : `(${protocol}${something}+)`,
  image: `(${protocol}${something}+?\\.(?:gif|jpg|jpeg|png|svg|webp)(?:$|\\?${something}*))`,
  tag  : `(?<=^|\\s+)(#${something}+)`,
  npub : "(?<=^|\\s+)(npub[0-9a-z]{59})",
  note : "(?<=^|\\s+)(note[0-9a-z]{59})",
}

const regex = {
  url  : new RegExp(pattern.url, "g"),
  image: new RegExp(pattern.image, "g"),
  tag  : new RegExp(pattern.tag, "g"),
  npub : new RegExp(pattern.npub, "g"),
  note : new RegExp(pattern.note, "g"),
  all  : new RegExp(`${pattern.url}|${pattern.image}|${pattern.tag}|${pattern.npub}|${pattern.note}`, "g"),
}

export default text => text
  .split(regex.all)
  .filter(data => !!data)
  .map(data => {
    const type = regex.note.test(data)
      ? "note"
      : regex.npub.test(data)
        ? "npub"
        : regex.tag.test(data)
          ? "tag"
          : regex.image.test(data)
            ? "image"
            : regex.url.test(data)
              ? "url"
              : "text"
    return { type, data }
  })
