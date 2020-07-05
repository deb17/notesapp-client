<template>
  <li class="folder" v-if="notes.length > 0">
    <div class="raise">
      {{ getFolderName }}
      <img
        class="caret"
        :class="{ 'caret-active': showNotes }"
        @click="showNotes = !showNotes"
        src="../assets/caret.svg"
      />
      <img class="trash" src="../assets/trash.svg" @click="showFolderModal" />
    </div>
    <transition-group v-show="showNotes" name="slide-fade" tag="ul">
      <li class="file" v-for="note in getFolNotes" :key="note.id">
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
        </div>
      </li>
      <folder-item
        v-for="name in uniqueStart"
        :key="name"
        :notelist="getNotes(name)"
        :name="name"
        @deleteFolder="deleteFolder"
      />
    </transition-group>
  </li>
</template>

<script>
import FolderItem from '@/components/FolderItem.vue'
export default {
  name: 'folder-item',
  components: {
    FolderItem
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
      notes: [...this.notelist]
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
    delFolder() {
      this.showFolder = false
      this.$emit('deleteFolder', { name: this.notes[0].folder })
    },
    delNote({ id }) {
      this.showFile = false
      const temp = this.notes[0].folder
      const index = this.notes.findIndex(note => note.id === id)
      this.notes.splice(index, 1)
      if (this.notes.length === 0) {
        this.$emit('deleteFolder', { name: temp })
      }
    },
    deleteFolder({ name }) {
      this.notes = this.notes.filter(note => !note.folder.startsWith(name))
      if (this.notes.length === 0) {
        this.$emit('deleteFolder', { name })
      }
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 25px;
}
.raise {
  position: relative;
  bottom: 6px;
}
.caret,
.edit {
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
  bottom: 4px;
  cursor: pointer;
}
li {
  padding: 5px 0;
}
li.folder {
  list-style-image: url(../assets/folder.svg);
}
li.file {
  list-style-image: url(../assets/file.svg);
}
a {
  color: blue;
}
</style>
