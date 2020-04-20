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
      masonry: [],
      slotsIndexPointer: 0
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
    // let self = <any>this;
  },
  beforeMount() {
    let self = <any>this;

    self.masonry = self.$slots.default.map((slot, index) => {
      return <any>new Vue({
        render(f) {
          return slot;
        }
      }).$mount();
    });
    self.slotsIndexPointer = self.$slots.default.length;
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
  beforeUpdate() {
    let self = <any>this;

    for (let i = self.slotsIndexPointer; i < self.$slots.default.length; i++) {
      self.masonry.push(
        <any>new Vue({
          render(f) {
            return self.$slots.default[i];
          }
        }).$mount()
      );
    }
    self.slotsIndexPointer = self.$slots.default.length;
  },
  updated() {
    let self = <any>this;
    self.layout();
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
      let columnsElem = <any>Array.from(self.$el.children);
      let shortestColumn = <any>null;
      let count = 0;

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
            }
          }
        }
      );
    }
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