<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class Masonry extends Vue {
  @Prop({ type: Number, default: 2 }) cols!: number;
  @Prop({ type: Number, default: 0 }) gutter!: number;
  // @Prop({ type: Boolean, default: false }) isWaitImage!: boolean;

  // data()
  private masonry: Array<any> | any = [];

  // methods
  public removeAllChilds(parent): void {
    parent.children.forEach(children => {
      while (children.lastChild) {
        children.removeChild(children.lastChild);
      }
    });
  }

  public imagesLoaded(masonry, callback): void {
    masonry.getElementsByTagName("img").forEach((img, index) => {
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
  }

  public layout(): void {
    // Dynamic masonry algorithm
    let masonryElem = <any>this.$refs.masonry;
    let columnsElem = <any>Array.from(masonryElem.children);

    let defaultSlots = this.$slots.default || [];
    let shortestColumn = <any>null;

    let imgCount = masonryElem.getElementsByTagName("img").length;
    let imgCompletedCount = 0;

    this.imagesLoaded(masonryElem, (complete, index) => {
      if (complete) imgCompletedCount++;

      if (imgCount === imgCompletedCount) {
        masonryElem.children.forEach(children => {
          while (children.lastChild) {
            children.removeChild(children.lastChild);
          }
        });

        defaultSlots.forEach(children => {
          shortestColumn = columnsElem.reduce((prev, cur) => {
            return prev.clientHeight <= cur.clientHeight ? prev : cur;
          });
          shortestColumn.appendChild(children.elm);
        });
        this.$emit("isRendered", true);
      }
    });
  }

  // lifecycle hooks
  render(createElement) {
    console.log("render", this.$slots.default?.length);

    let defaultSlots = this.$slots.default || [];
    let columnsElem = <any>[];
    let columns = <any>[];

    // Loop through slots
    for (let i = 0, j = 0; i < defaultSlots.length; i++, j++) {
      // Get the column index the slot will end up in
      const columnIndex = j % this.cols;

      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }

      columns[columnIndex].push(defaultSlots[i]);
    }

    for (let i = 0; i < this.cols; i++) {
      columnsElem.push(
        createElement(
          "div",
          {
            class: ["masonry__elem--height flex flex-col flex-wrap"],
            style: {
              width: 100 / this.cols - this.gutter + "%"
            }
          },
          columns[i]
        )
      );
    }

    return createElement(
      "div",
      {
        ref: "masonry",
        class: ["masonry flex flex-row justify-between"]
      },
      columnsElem
    );
  }

  beforeCreate() {
    console.log("beforeCreate", this.$slots.default?.length);
  }

  created() {
    console.log("created", this.$slots.default?.length);
  }

  beforeMount() {
    console.log("beforeMount", this.$slots.default?.length);
  }

  mounted() {
    console.log("mounted", this.$slots.default?.length);

    this.$nextTick(() => {
      this.layout();
    });
  }

  beforeUpdate() {
    console.log("beforeUpdate", this.$slots.default?.length);
  }
  updated() {
    console.log("updated", this.$slots.default?.length);
    this.$nextTick(() => {
      this.layout();
    });
  }

  beforeDestroy() {
    console.log("beforeDestroy", this.$slots.default?.length);
  }
  destroyed() {
    console.log("destroyed", this.$slots.default?.length);
  }
}
</script>

<style lang="scss">
.masonry {
  &__elem {
    -webkit-column-break-inside: avoid;

    &--height {
      height: fit-content;
      height: -moz-fit-content;
    }
  }
}
</style>