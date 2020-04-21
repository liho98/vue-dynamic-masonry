<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class Masonry extends Vue {
  @Prop({ type: [Number], default: 2 }) cols!: boolean;
  @Prop({ type: [Number], default: 0 }) gutter!: boolean;
  @Prop({ type: [Boolean], default: false }) isWaitImage!: boolean;

  private masonry: Array<any> = [];
  private loader: Array<any> = [];
  private slotsIndexPointer: number = 0;

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
  }

  created() {
    let self = <any>this;

    if (self.isWaitImage) {
      if (self.$slots.loader) {
        self.loader = self.$slots.loader.map((slot, index) => {
          return <any>new Vue({
            render(f) {
              return slot;
            }
          }).$mount();
        });
      }
    } else {
      self.masonry = self.$slots.default.map((slot, index) => {
        return <any>new Vue({
          render(f) {
            return slot;
          }
        }).$mount();
      });
      self.slotsIndexPointer = self.$slots.default.length;
    }
  }

  mounted() {
    let self = <any>this;
    let columnsElem = <any>Array.from(self.$el.children);

    if (self.isWaitImage) {
      if (self.$slots.loader) {
        columnsElem.forEach((children, index) => {
          children.appendChild(self.loader[index].$el);
        });
      }
    } else {
      self.masonry.forEach((children, index) => {
        self.$el.children[index % self.cols].appendChild(children.$el);
      });
      this.$emit("isRendered", true);
    }
  }

  beforeUpdate() {
    let self = <any>this;
    let columnsElem = <any>Array.from(self.$el.children);
    if (self.$slots.default) {
      for (
        let i = self.slotsIndexPointer;
        i < self.$slots.default.length;
        i++
      ) {
        self.masonry.push(
          <any>new Vue({
            render(f) {
              return self.$slots.default[i];
            }
          }).$mount()
        );
      }
      self.slotsIndexPointer = self.$slots.default.length;
    }
  }

  updated() {
    let self = <any>this;
    let columnsElem = <any>Array.from(self.$el.children);

    if (self.isWaitImage) {
      if (self.$slots.loader) {
        columnsElem.forEach((children, index) => {
          children.appendChild(self.loader[index].$el);
        });
      }
      self.layout();
    } else {
      self.masonry.forEach((children, index) => {
        self.$el.children[index % self.cols].appendChild(children.$el);
      });
      this.$emit("isRendered", true);
    }
  }

  public isImageLoaded(masonry, callback): void {
    let self = <any>this;

    masonry.forEach((children, index) => {
      children.$el.getElementsByTagName("img").forEach(img => {
        if (img.complete) {
          callback(img.complete, index);
        } else {
          img.onload = () => {
            callback(img.complete, index);
          };
          img.onerror = () => {
            // todo: wait for error image to load before render
            img.src =
              "https://www.narrowpathwinery.com/assets/images/products/large/no-user-Image.png";
            callback(img.complete, index);
          };
        }
      });
    });
  }

  public layout(): void {
    // Dynamic masonry algorithm
    let self = <any>this;
    let columnsElem = <any>Array.from(self.$el.children);
    let shortestColumn = <any>null;
    let count = 0;

    self.isImageLoaded(self.masonry, (complete, index) => {
      if (complete) count++;

      if (self.masonry.length === count) {
        while (self.masonry.length) {
          shortestColumn = columnsElem.reduce((prev, cur) => {
            return prev.clientHeight <= cur.clientHeight ? prev : cur;
          });
          shortestColumn.appendChild(self.masonry.shift().$el);
        }

        if (self.$slots.loader) {
          columnsElem.forEach((children, i) => {
            children.appendChild(self.loader[i].$el);
          });
        }

        this.$emit("isRendered", true);
      }
    });
  }
}
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