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
    </div>
</template>

<script>
export default {
    
}
</script>

<style>

</style>
