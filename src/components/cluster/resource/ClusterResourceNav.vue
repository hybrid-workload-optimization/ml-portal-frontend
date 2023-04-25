<template>
  <nav class="menu-navigation">
    <ul>
      <li>{{ mainMenu }}</li>
      <li><span> > </span></li>
      <li>{{ subMenu }}</li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    mainMenu: String,
    subMenu: String,
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.menu-navigation {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  margin: 0;
  padding: 0;
  display: inline-block;
}

.menu-navigation ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.menu-navigation ul li {
  color: #808080;
  margin: 0;
  padding: 0;
}

.menu-navigation ul li span {
  margin: 0 10px;
}

.menu-navigation ul li a {
  color: #333;
  text-decoration: none;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.menu-navigation ul li a:hover {
  cursor: auto;
  // background-color: #eee;
}
</style>
