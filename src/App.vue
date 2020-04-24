<template>
  <div id="app">
    <Masonry class="app__masonry" :cols="2" :gutter="2">
      <div class="app__masonry__card" v-for="(card, index) in cards" :key="index">
        <div class="app__masonry__card__imagebox">
          <img :src="card.image" class="card__imagebox__icon" />
        </div>
        <div class="app__masonry__card__content">
          <div class="app__masonry__card__content__heading">{{card.heading}}</div>
          <div class="app__masonry__card__content__sub-heading">{{card.subHeading}}</div>
        </div>
      </div>
    </Masonry>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Masonry from "@/components/Masonry.vue";

@Component({
  components: {
    Masonry
  }
})
export default class App extends Vue {
  public cards: Array<any> = [
    {
      heading: "1 Hand Sanitizer",
      subHeading: "Rm 10.99",
      image: "https://source.unsplash.com/random?Sanitizer"
    },
    {
      heading: "2 Face Mask",
      subHeading: "Rm 1.99",
      image: "https://source.unsplash.com/random?Mask"
    },
    {
      heading: "3 Ice cream",
      subHeading: "Rm 1.99",
      image: "https://source.unsplash.com/random?Icecream"
    },
    {
      heading: "4 Air Pod",
      subHeading: "Rm 1.99",
      image: "https://source.unsplash.com/random?Airpod"
    },
    {
      heading: "5 Sugar - Brown",
      subHeading: "RM 94.53",
      image: "https://source.unsplash.com/random?Sugar"
    },
    {
      heading: "6 Lentils - Green, Dry",
      subHeading: "RM 51.29",
      image: "https://source.unsplash.com/random?Lentils"
    },
    {
      heading: "7 Sauce Bbq Smokey",
      subHeading: "RM 21.65",
      image: "https://source.unsplash.com/random?Bbq"
    },
    {
      heading: "8 Cookie Dough - Chocolate Chip",
      subHeading: "RM 25.62",
      image: "https://source.unsplash.com/random?Cookie"
    },
    {
      heading: "9 Apples - Spartan",
      subHeading: "RM 8.33",
      image: "https://source.unsplash.com/random?Apples"
    },
    {
      heading: "10 Sauce - Demi Glace",
      subHeading: "RM 27.95",
      image: "https://source.unsplash.com/random?Sauce"
    }
  ];
}
</script>

<style lang="scss">
.app {
  &__masonry {
    &__card {
      @apply flex flex-col h-auto w-full rounded shadow-lg z-10;

      &__imagebox {
        @apply relative rounded bg-cover text-center text-xs;
        flex: 1 3 35%;
        flex-shrink: 0;
        box-shadow: 0.2em 0.2rem 1rem -1rem #000;
      }

      &__content {
        @apply relative z-10 rounded rounded-l-none p-3 px-5 text-black;
        flex: 3 1 65%;
        &__heading {
          @apply tracking-wide;
        }
        &__sub-heading {
          @apply text-xs my-1;
        }
      }
      & + & {
        @apply mt-5;
      }
    }
  }
}
</style>
