((window) => {

    var Main = {
        template: ` <div>
                    <input type="file" ref='fileElem' accept="*" style="display:none" @change="handleFiles">
                    <button @click='selectFile'>选择文件</button>
                    <div id="content" ref='content' v-html="htmlData"> </div>
                    {{filelist}} 

                    </div>
                `,
        data() {
            return {
                htmlData: "",
                filelist: []
            }
        },

        created() {
            this.getHtml();
            this.getfilelist()
        },
        methods: {
            async getHtml() {
                const { data } = await axios.get('/html');
                this.htmlData = await data.replace(/<pre>/g, '<pre class="hljs">');
            },
            selectFile() {
                this.$refs.fileElem.click()
            },

            handleFiles(e) {
                const files = e.target.files
                console.log(files);

                this.FileUpload(files[0])
            },
            async FileUpload(file) {
                const uri = "/FileUpload";
                const fd = new FormData();
                fd.append('file', file);
                const res = await axios.post(uri, fd, {
                    headers: {
                        'Content-Type': "application/x-www-form-urlencoded"
                    }
                })
            },
            async getfilelist() {
                const uri = "/filelist";
                const res = await axios.post(uri)

                this.filelist = res
            }
        }
    }
    window.__Main = Main
})(window)
