<template>
  <div class="card">
    <div class="w-full h-full sm:w-1/3">
      <div class="card-img">
        <slot name="img"></slot>
      </div>
    </div>
    <div class="w-full h-full sm:w-2/3 sm:pl-2">
      <div class="card-text">
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  box-shadow: 0px 5px 7.5px 2.5px rgba(0, 0, 0, 0.1);
  transition: transform 0.125s ease-in-out, box-shadow 0.125s ease-in-out;
}
.card:hover {
  cursor: pointer;
  transform: scale(1.025);
  box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.075);
}
.card-img {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 66%;
}
.card-img img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-text {
  padding: 1rem 0.5rem 0.5rem;
  line-height: 1.125;
}

@media screen and (min-width: 625px) {
  .card {
    display: flex;
  }
  .card-text {
    padding: 0.5rem;
  }
}
</style>
