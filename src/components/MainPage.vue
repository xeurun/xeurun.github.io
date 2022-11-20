<script setup lang="ts">
// import { defineComponent } from 'vue'

// defineProps<{
//   msg: string
// }>();

// export default defineComponent({
//   // type inference enabled
//   props: {
//     name: String,
//     msg: { type: String, required: true }
//   },
//   data() {
//     return {
//       count: 1
//     }
//   },
//   mounted() {
//     this.name // type: string | undefined
//     this.msg // type: string
//     this.count // type: number
//   }
// })
</script>

<template>
  <main>
    <div class="block center-block ng-scope">
      <div class="block-header">
        <div class="avatar">
          <img src="./images/avatar3.png" alt="" />
        </div>
      </div>
      <div class="block-main">
        <h1 class="me">Alexey<br />Stepankov</h1>
        <p class="details">
          TeamLead
          <br />
          Fullstack Developer
        </p>
      </div>
      <div class="block-footer">
        <a href="https://github.com/xeurun" target="_blank">
          <font-awesome-icon icon="fa-brands fa-github" size="2x" />
        </a>

        <a href="https://www.linkedin.com/in/alexeystepankov/" target="_blank">
          <font-awesome-icon icon="fa-brands fa-linkedin" size="2x" />
        </a>

        <a
          href="https://stackoverflow.com/users/2728796/xeurun"
          target="_blank"
        >
          <font-awesome-icon icon="fa-brands fa-stack-overflow" size="2x" />
        </a>
      </div>
    </div>
  </main>
  <footer id="footer">
    <span class="copyright">&copy; Alexey Stepankov</span>
  </footer>
</template>

<style scoped lang="scss">
.me {
  font-weight: 900;
  letter-spacing: 0.3em;
  line-height: 1em;
  margin-left: 0.3em;
}

.details {
  line-height: normal;
}

.block-main {
  margin: 3em 0;
}

.block {
  max-width: 100%;
  min-width: 27em;
  padding: 3em 1em;
  box-shadow: 0 0 1px 1px var(--color-app-black) inset;

  background: var(--color-app-bg);
  border-radius: _size(border-radius);
  cursor: default;
  opacity: 0.95;
  text-align: center;

  transform-origin: 50% 50%;
  transform: rotateX(0deg);
  transition: opacity #{_duration(main)} ease, transform #{_duration(main)} ease;

  @media (max-width: 480px) {
    min-width: 0;
    width: 100%;
    padding: 4em 2em;
  }

  body.loading & {
    opacity: 0;
    transform: rotateX(15deg);
  }
}

.center-block {
  position: relative;

  .avatar {
    position: relative;
    display: block;

    img {
      display: block;
      margin: 0 auto;
      border-radius: 100%;
      box-shadow: 0 0 0px 1px var(--color-app-border) inset;
      background-color: var(--color-app-white);
      pointer-events: none;
    }

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: -1em;
      width: calc(100% + 2em);
      height: _size(border-width);
      z-index: -1;
      background: var(--color-app-border);
    }
  }

  @media (max-width: 480px) {
    .avatar {
      &:before {
        left: -2em;
        width: calc(100% + 4em);
      }
    }
  }
}

.block-footer {
  display: inline-flex;
  width: 100%;
  justify-content: space-evenly;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4em;
    height: 4em;
    border-radius: 100%;
    border: solid 1px var(--color-app-border);
    color: var(--color-app-border);
  }

  a:hover {
    border-color: var(--color-app-black);
    color: var(--color-app-black);
  }

  @media screen and (max-width: 480px) {
    a svg {
      font-size: 1.5rem;
    }
  }
}

footer {
  align-self: flex-end;
  width: 100%;
  padding: _size(element-margin) 0 0 0;
  cursor: default;
  text-align: center;

  span {
    box-shadow: 0 0 1px 1px var(--color-app-black) inset;
    background: var(--color-app-white);
    border-radius: 1em;
    padding: 5px 15px;
  }
}
</style>
