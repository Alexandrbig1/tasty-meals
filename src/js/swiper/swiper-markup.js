export function createMarkup(slides) {
  return slides
    .map(
      ({
        cook: { name, imgUrl, imgWebpUrl },
        topic: {
          area,
          imgUrl: img,
          name: dish,
          imgWebpUrl: imgWebp,
          previewWebpUrl,
          previewUrl,
        },
      }) => `
        <div class="swiper-slide">
          <picture class="chef">
            <source media="(min-width: 0px)" srcset="${imgWebpUrl}" type="image/webp" />
            <source media="(min-width: 0px)" srcset="${imgUrl}" type="image/jpg" />
            <img src="${imgUrl}" alt="${name}" />
          </picture>
        </div>
        <div class="swiper-slide">
          <picture class="dish">
            <source media="(min-width: 0px)" srcset="${imgWebp}" type="image/webp" />
            <source media="(min-width: 0px)" srcset="${img}" type="image/jpg" />
            <img src="" alt="" />
          </picture>
          <h2 class="title">${dish}</h2>
          <p class="area">${area}</p>
        </div>
        <div class="swiper-slide">
          <picture class="preview">
            <source media="(min-width: 0px)" srcset="${previewWebpUrl}" type="image/webp" />
            <source media="(min-width: 0px)" srcset="${previewUrl}" type="image/jpg" />
            <img src="" alt="" />
          </picture>
    `
    )
    .join('');
}
