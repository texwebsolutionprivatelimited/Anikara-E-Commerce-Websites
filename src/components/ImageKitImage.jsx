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

  if (!responsive) {
    return (
      <img
        {...imageProps}
        loading={loading}
        src={buildSrc({
          src,
          transformation,
          queryParameters,
          urlEndpoint,
          transformationPosition
        })}
      />
    );
  }

  const responsiveAttrs = getResponsiveImageAttributes({
    src,
    transformation,
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
