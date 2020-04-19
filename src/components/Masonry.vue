<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    cols: {
      type: [Number],
      default: 2
    },
    gutter: {
      type: [Number],
      default: 0
    },
    waitImage: {
      type: [Boolean],
      default: true
    }
  },
  data() {
    return {
      masonry: []
    };
  },
  render(createElement) {
    let self = <any>this;
    let columns = <any>[];

    for (let i = 0; i < self.cols; i++) {
      columns.push(
        createElement("div", {
          class: ["masonry__elem--margin-left flex flex-col flex-wrap"],
          style: {
            width: 100 / self.cols - self.gutter + "%",
            "flex-basis": 100 / self.cols + "%",
            height: "fit-content"
          }
        })
      );
    }
    return createElement(
      "div",
      {
        ref: "masonry",
        class: ["masonry flex flex-row justify-between"]
      },
      columns
    );
  },
  created() {
    let self = <any>this;

    for (let i = 0; i < self.$slots.default.length; i++) {
      var vm = <any>new Vue({
        render(f) {
          return self.$slots.default[i];
        }
      }).$mount();
      self.masonry.push(vm);
    }
  },
  mounted() {
    let self = <any>this;

    if (self.waitImage) {
      self.layout();
    } else {
      self.masonry.forEach((children, index) => {
        self.$el.children[index % self.cols].appendChild(children.$el);
      });
      if (self.$parent.$parent.$parent.$parent.$refs.tabSwiper.$swiper) {
        self.$parent.$parent.$parent.$parent.$refs.tabSwiper.$swiper.updateAutoHeight(
          500
        );
      }
    }
  },
  methods: {
    imageCallback(masonry, callback) {
      masonry.forEach((children, index) => {
        children.$el.getElementsByTagName("img").forEach(img => {
          if (img.complete) {
            callback(children, children.$el.clientHeight, index, img.complete);
          } else {
            img.onload = () => {
              callback(
                children,
                children.$el.clientHeight,
                index,
                img.complete
              );
            };
          }
        });
      });
    },
    layout() {
      // Dynamic masonry algorithm
      let self = <any>this;
      let count = 0;
      let columnsElem = <any>Array.from(self.$el.children);
      let shortestColumn = <any>null;

      self.imageCallback(
        self.masonry,
        (children, clientHeight, index, complete) => {
          if (complete) count++;

          if (self.masonry.length === count) {
            while (self.masonry.length) {
              shortestColumn = columnsElem.reduce((prev, cur) => {
                return prev.clientHeight <= cur.clientHeight ? prev : cur;
              });
              shortestColumn.appendChild(self.masonry.shift().$el);

              if (
                self.$parent.$parent.$parent.$parent.$refs.tabSwiper.$swiper
              ) {
                self.$parent.$parent.$parent.$parent.$refs.tabSwiper.$swiper.updateAutoHeight(
                  500
                );
              }
              self.$forceUpdate();
            }
          }
        }
      );

      // self.masonry.forEach(children => {
      //   imgs.push(...children.$el.getElementsByTagName("img"));
      // });

      // if (img.complete) {
      //   count = count + 1;
      // }
      // if (self.masonry.length === count) {
      //   while (self.masonry.length) {
      //     shortestColumn = columnsElem.reduce((prev, cur) => {
      //       return prev.clientHeight <= cur.clientHeight ? prev : cur;
      //     });
      //     shortestColumn.appendChild(self.masonry.shift().$el);
      //   }
      // }
    }
    // imageCallback(imgs, callback): void {
    //   imgs.forEach(img => {
    //     if (img.complete) {
    //       callback(
    //         img,
    //         img.width,
    //         img.height,
    //         Number(img.height) / Number(img.width)
    //       );
    //     } else {
    //       img.onload = () => {
    //         callback(
    //           img,
    //           img.width,
    //           img.height,
    //           Number(img.height) / Number(img.width)
    //         );
    //       };
    //     }
    //   });
    // },
  }
});
</script>

<style lang="scss">
.masonry {
  &__elem {
    -webkit-column-break-inside: avoid;

    &--margin-left + &--margin-left {
      margin-left: 1rem;
    }
  }
}
</style>