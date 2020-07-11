<template>
  <li class="folder" v-if="notes.length > 0">
    <div class="raise">
      <span class="d-none d-sm-inline">{{ getFolderName }}</span>
      <span class="d-sm-none">{{ getFolderNameSm }}</span>
      <img
        class="caret"
        :class="{ 'caret-active': showNotes }"
        @click="showNotes = !showNotes"
        src="../assets/caret.svg"
      />
      <img class="trash" src="../assets/trash.svg" @click="showFolderModal" />
      <img
        v-show="loaderShow"
        class="item-loader"
        src="../assets/item-loader.gif"
      />
    </div>
    <transition-group v-show="showNotes" name="slide-fade" tag="ul">
      <note-item
        v-for="note in getFolNotes"
        :key="note.id"
        :note="note"
        @deleteNote="deleteNote"
        @delEvent="deliverMsg"
      />
      <folder-item
        v-for="name in uniqueStart"
        :key="name"
        :notelist="getNotes(name)"
        :name="name"
        @deleteFolder="deleteFolder"
        @delEvent="deliverMsg"
      />
    </transition-group>
  </li>
</template>

<script>
import FolderItem from '@/components/FolderItem.vue'
import NoteItem from '@/components/NoteItem.vue'
import { delFolderServer } from '@/asyncActions'

export default {
  name: 'folder-item',
  components: {
    FolderItem,
    NoteItem
  },
  props: {
    notelist: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showNotes: false,
      notes: [...this.notelist],
      loaderShow: false
    }
  },
  computed: {
    getFolNotes() {
      const firstPartOfName = this.name.split('/')[0]
      if (this.notes[0].folder.endsWith(firstPartOfName)) {
        return this.notes.filter(note => note.folder === this.notes[0].folder)
      } else {
        return []
      }
    },
    getFolderName() {
      return this.name.split('/')[0]
    },
    getFolderNameSm() {
      const folName = this.firstPart
      return folName.replace(/\//g, ' / ')
    },
    folderNames() {
      let prev = ''
      const result = []
      this.notes.forEach(note => {
        if (note.folder !== prev) {
          prev = note.folder
          result.push(prev)
        }
      })
      return result
    },
    firstPart() {
      const firstPartOfName = this.name.split('/')[0]
      const firstFolder = this.notelist[0].folder
      const len = firstFolder.length - this.name.length
      return firstFolder.slice(0, len) + firstPartOfName
    },
    subFolders() {
      const folders = this.folderNames
      const len = this.firstPart.length + 1
      const result = []
      folders.forEach(name => {
        const sub = name.slice(len)
        if (sub) {
          result.push(sub)
        }
      })
      return result
    },
    uniqueStart() {
      const folders = this.subFolders
      let prev = ''
      const result = []
      folders.forEach(name => {
        const firstPart = name.split('/')[0]
        if (firstPart !== prev) {
          prev = firstPart
          result.push(name)
        }
      })
      return result
    }
  },
  methods: {
    getNotes(name) {
      const firstPart = this.firstPart + '/' + name.split('/')[0]
      return this.notes.filter(note => note.folder.startsWith(firstPart))
    },
    showFolderModal() {
      this.$bvModal
        .msgBoxConfirm(
          'Do you want to delete this folder and all its contents, including subfolders?',
          {
            title: 'Confirm delete',
            okVariant: 'danger',
            okTitle: 'Delete',
            cancelTitle: 'Cancel',
            footerClass: 'p-2',
            hideHeaderClose: false
          }
        )
        .then(value => {
          if (value) {
            this.delFolder()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    delFolder() {
      this.loaderShow = true
      this.showFolder = false
      this.$emit('deleteFolder', {
        name: this.notes[0].folder,
        msg: true,
        server: true
      })
    },
    deleteFolder({ name, msg, server }) {
      if (server) {
        delFolderServer({ folder: name }).then(data => {
          this.loaderShow = false
          if (msg) {
            this.$emit('delEvent', data)
          }
          this.notes = this.notes.filter(note => !note.folder.startsWith(name))
          if (this.notes.length === 0) {
            this.$emit('deleteFolder', { name, msg: false, server: false })
          }
        })
      } else {
        this.notes = this.notes.filter(note => !note.folder.startsWith(name))
        if (this.notes.length === 0) {
          this.$emit('deleteFolder', { name, msg: false, server: false })
        }
      }
    },
    deleteNote(id) {
      const temp = this.notes[0].folder
      const index = this.notes.findIndex(note => note.id === id)
      this.notes.splice(index, 1)
      if (this.notes.length === 0) {
        this.$emit('deleteFolder', { name: temp, msg: false, server: false })
      }
    },
    deliverMsg(data) {
      this.$emit('delEvent', data)
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 25px;
  margin-left: -5px;
}
.raise {
  position: relative;
  bottom: 6px;
}
.caret {
  position: relative;
  bottom: 2px;
  margin-left: 15px;
  margin-right: 5px;
  cursor: pointer;
}
.caret {
  transition: transform 0.5s;
}
.caret-active {
  transform: rotate(180deg);
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
li.folder {
  list-style-image: url(../assets/folder.svg);
  padding: 5px 0px 5px 5px;
}
@media (max-width: 575.9px) {
  ul {
    padding-inline-start: 0;
  }
}
</style>
