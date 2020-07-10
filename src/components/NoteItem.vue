<template>
  <li class="file">
    <div class="raise">
      <router-link
        :to="{
          name: 'old-note',
          params: { id: note.id, mode: 'view' }
        }"
      >
        {{ note.title }}
      </router-link>
      <router-link
        :to="{
          name: 'old-note',
          params: { id: note.id, mode: 'edit' }
        }"
        ><img src="../assets/edit.svg" class="edit"
      /></router-link>
      <img
        src="../assets/trash.svg"
        class="trash"
        @click="showFileModal(note)"
      />
      <img
        v-show="loaderShow"
        class="item-loader"
        src="../assets/item-loader.gif"
      />
    </div>
  </li>
</template>

<script>
import { delNoteServer } from '@/asyncActions'
export default {
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loaderShow: false
    }
  },
  methods: {
    showFileModal(note) {
      this.$bvModal
        .msgBoxConfirm('Do you want to delete this note?', {
          title: 'Confirm delete',
          okVariant: 'danger',
          okTitle: 'Delete',
          cancelTitle: 'Cancel',
          footerClass: 'p-2',
          hideHeaderClose: false
        })
        .then(value => {
          if (value) {
            this.delNote(note)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    delNote({ id }) {
      this.loaderShow = true
      delNoteServer(id).then(data => {
        this.loaderShow = false
        this.$emit('delEvent', data)
        this.$emit('deleteNote', id)
      })
    }
  }
}
</script>

<style scoped>
.raise {
  position: relative;
  bottom: 6px;
}
.edit {
  position: relative;
  bottom: 2px;
  margin-left: 15px;
  margin-right: 5px;
  cursor: pointer;
}
.trash {
  position: relative;
  bottom: 2px;
  cursor: pointer;
}
.item-loader {
  margin-left: 5px;
  position: relative;
  bottom: 2px;
}
li {
  padding: 5px 0;
}
li.file {
  list-style-image: url(../assets/file.svg);
}
@media (max-width: 575.9px) {
  li.file {
    margin-left: 20px;
  }
}
a {
  color: blue;
}
</style>
