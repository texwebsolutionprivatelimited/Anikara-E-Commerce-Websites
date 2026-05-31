import React from "react";
import { buildSrc, getResponsiveImageAttributes } from "@imagekit/javascript";

const DEFAULT_IMAGEKIT_URL = "https://ik.imagekit.io/feu3swboqb";

export default function ImageKitImage({
  src = "",
  transformation = [],
  queryParameters,
  urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL || DEFAULT_IMAGEKIT_URL,
  transformationPosition,
  sizes,
  responsive = true,
  deviceBreakpoints,
  imageBreakpoints,
  loading = "lazy",
  ...imageProps
}) {
  if (!src || !urlEndpoint) {
    return null;
  }

  const width = Number.parseInt(imageProps.width, 10);

  // Default to format: "webp" to guarantee WebP delivery for better load/response times
  const hasFormat = transformation.some(t => t.format || t.f);
  const finalTransformation = hasFormat 
    ? transformation 
    : [{ format: "webp" }, ...transformation];

  if (!responsive) {
    return (
      <img
        {...imageProps}
        loading={loading}
        src={buildSrc({
          src,
          transformation: finalTransformation,
          queryParameters,
          urlEndpoint,
          transformationPosition
        })}
      />
    );
  }

  const responsiveAttrs = getResponsiveImageAttributes({
    src,
    transformation: finalTransformation,
    width: Number.isNaN(width) ? undefined : width,
    sizes,
    queryParameters,
    urlEndpoint,
    transformationPosition,
    deviceBreakpoints,
    imageBreakpoints
  });

  return (
    <img
      {...imageProps}
      loading={loading}
      sizes={sizes}
      srcSet={responsiveAttrs.srcSet}
      src={responsiveAttrs.src}
    />
  );
}

