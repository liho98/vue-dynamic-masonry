<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class Masonry extends Vue {
  @Prop({ type: Number, default: 2 }) cols!: number;
  @Prop({ type: Number, default: 0 }) gutter!: number;
  @Prop({ type: Boolean, default: false }) isWaitImage!: boolean;

  private masonry: Array<any> | any = [];
  private loader: Array<any> | any = null;

  render(createElement) {
    // console.log("render", this.$slots.default?.length);
    let columns = <any>[];

    for (let i = 0; i < this.cols; i++) {
      columns.push(
        createElement(
          "div",
          {
            class: ["masonry__elem--height flex flex-col flex-wrap"],
            style: {
              width: 100 / this.cols - this.gutter + "%"
            }
          },
          this.$slots.loader !== null ? this.$slots.loader : null
        )
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

  beforeCreate() {
    // console.log("beforeCreate", this.$slots.default?.length);
  }

  created() {
    // console.log("created", this.$slots.default?.length);
    if (this.$slots.default) {
      this.masonry = this.getMasonryItems();
    }
    if (this.$slots.loader) {
      this.loader = this.getLoader();
    }
    // console.log("this.loader", this.loader);
  }

  beforeMount() {
    // console.log("beforeMount", this.$slots.default?.length);
  }

  mounted() {
    // console.log("mounted", this.$slots.default?.length);
    this.layout();
  }

  beforeUpdate() {
    // console.log("beforeUpdate", this.$slots.default?.length);

    if (this.$slots.default) {
      this.masonry = this.getMasonryItems();
    }
  }
  updated() {
    // console.log("updated", this.$slots.default?.length);
    this.layout();
  }

  beforeDestroy() {
    // console.log("beforeDestroy", this.$slots.default?.length);
  }
  destroyed() {
    // console.log("destroyed", this.$slots.default?.length);
  }

  public getLoader(): any {
    return this.$slots.loader!.map(slot => {
      return new Vue({
        render(f) {
          return slot;
        }
      }).$mount();
    });
  }

  public getMasonryItems(): any {
    return this.$slots.default!.map(slot => {
      return new Vue({
        render(f) {
          return slot;
        }
      }).$mount();
    });
  }

  public removeAllChilds(parent): void {
    parent.children.forEach(children => {
      while (children.lastChild) {
        children.removeChild(children.lastChild);
      }
    });
  }

  public imagesLoaded(masonry, callback): void {
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
    let columnsElem = <any>Array.from((<any>this.$refs.masonry).children);
    let shortestColumn = <any>null;
    let count = 0;

    this.imagesLoaded(this.masonry, (complete, index) => {
      if (complete) count++;

      if (this.masonry.length === count) {
        this.removeAllChilds(<any>this.$refs.masonry);

        this.masonry.forEach(children => {
          shortestColumn = columnsElem.reduce((prev, cur) => {
            return prev.clientHeight <= cur.clientHeight ? prev : cur;
          });
          shortestColumn.appendChild(children.$el);
        });

        // if (this.loader != null) {
        //   for (let i = 0; i < this.cols; i++) {
        //     shortestColumn = columnsElem.reduce((prev, cur) => {
        //       return prev.clientHeight <= cur.clientHeight ? prev : cur;
        //     });
        //     shortestColumn.appendChild(this.loader[i].$el);
        //   }
        // }
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

    // &--margin-left + &--margin-left {
    //   margin-left: 1rem;
    // }

    &--height {
      height: fit-content;
      height: -moz-fit-content;
    }
  }
}
</style>