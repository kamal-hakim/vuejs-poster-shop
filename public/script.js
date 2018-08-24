const PRICE = 9.99;
const LAST_NUM = 5;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        search: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE,
        results: []
    },
    computed: {
        hasResults: function() {
            return this.results.length > 0;
        }
    },
    methods: {
        appendItems: function() {
            if(this.items.length < this.results.length){
                var append = this.results.slice(this.items.length, this.items.length + LAST_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function() {
            this.loading = true;
            this.items = [];
            this.$http
            .get('/search/'.concat(this.search))
            .then(function(res) {
                this.lastSearch = this.search;
                this.search = '';
                this.results = res.data;
                this.items = this.results.splice(0, LAST_NUM);
                this.loading = false;
            });
        },
        addItem: function(index) {
            var item = this.items[index];
            this.total += this.price;
            var inCart = false;
            this.cart.forEach(element => {
                if(element.id == item.id) {
                    element.qty++;
                    inCart = true;
                    
                }
            });
            if(!inCart) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    price: this.price,
                    qty: 1
                });
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += this.price;
        },
        dec: function(item) {
            item.qty--;
            this.total -= this.price;
            if(item.qty <= 0) {
                this.cart.forEach((element, index) => {
                        if(element.id == item.id) {
                            this.cart.splice(index, 1);
                            
                        }
                });
            }
        }
    },
    filters: {
        currency: function(price) {
            return '$' + price.toFixed(2);
        }
    },
    mounted: function() {
        var vm = this;
        this.onSubmit();
        var elem = document.getElementById("product-bottom-last");
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            vm.appendItems();
        });
    }
});
