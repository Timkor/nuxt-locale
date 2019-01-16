<template>
    <div>

        <h1 class="title">
            {{$locale.text('title')}}
        </h1>

        <div>
            <b>Number:</b>
            {{$locale.number(9999999.99)}}
        </div>
        
        <div>
            <b>Money:</b>
            {{$locale.money(20.3252353542)}}
        </div>
        
        <div>
            <b>Date:</b>
            {{$locale.date(new Date())}}
        </div>

        <div>
            {{$locale.text('description', { value: $locale.money(10, { minimumFractionDigits: 0 }) })}}
        </div>
    </div>
</template>

<script>
export default {
    transition: {
        name: 'fade',
        duration: 300,
    }
}
</script>

<style>

</style>
