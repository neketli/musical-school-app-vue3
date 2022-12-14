<template>
  <BaseLayout
    :sidebarData="sidebarData"
    :headerData="headerData"
    @setFilter="setFilter"
  >
    <div class="flex flex-col gap-8 justify-center">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg">
          Выбор предмета
        </h3>
        <vSelect
          v-model="activeSubject"
          class="min-w-[25%] bg-white"
          :options="subjects"
          placeholder="Предмет"
          @option:selected="getData"
        />
      </div>

      <div
        v-if="activeSubject"
        class="flex"
      >
        <div class="flex flex-col bg-white h-full">
          <div
            class="py-2 px-6 flex items-center border-b-[1px] border-b-grey-400 h-[45px] min-w-[200px]"
          >
            Дата занятий:
          </div>
          <template
            v-for="item in tableData"
            :key="item.name"
          >
            <div
              class="py-2 px-6 flex items-center border-b-[1px] border-b-grey-400 h-[45px] min-w-[200px] rounded-sm"
            >
              {{ item.name }}
            </div>
          </template>
        </div>

        <div class="flex overflow-auto flex-col gap-4">
          <VedomostiTable
            v-if="!isLoading"
            :columns="tableColumns"
            :data="tableData"
            @onRemove="remove"
            @onAdd="add"
            @onColumnSave="saveColumn"
          />
          <BaseSkelet
            v-else
            :size="200"
          />
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import { mapGetters } from "vuex";
import { BaseSkelet, VedomostiTable } from "@/components";
import BaseLayout from "@/layouts/BaseLayout.vue";
import { JournalsService } from "@/services";
import vSelect from "vue-select";

export default {
  components: {
    BaseLayout,
    VedomostiTable,
    BaseSkelet,
    vSelect,
  },
  data() {
    return {
      headerData: [],
      sidebarData: [],
      filter: {},

      tableColumns: [],
      tableData: [],
      newItem: {},

      groupsData: {},
      removeList: [],
      groupsColumns: {},
      activeGroup: null,
      subjects: [],
      activeSubject: null,

      isLoading: true,
      isModalShow: false,
      canEdit: false,
    };
  },
  computed: {
    ...mapGetters(["getUserInfo"]),
  },
  async created() {
    this.sidebarData = [
      {
        value: "back",
        label: "Назад",
        icon: "fa-chevron-left",
      },
    ];

    this.setGroup();

    const { data } = await this.$axios.get(
      `${import.meta.env.VITE_API_URL}/subjects`
    );
    this.subjects = data.map((item) => {
      return {
        id: item.id,
        label: item.title,
      };
    });

    this.isLoading = false;
  },
  methods: {
    async getData() {
      this.isLoading = true;
      const journalsData = await JournalsService.getData();

      const { data } = await this.$axios.get(
        `${import.meta.env.VITE_API_URL}/students/${this.getUserInfo.rid}`
      );
      const name = `${
        data.last_name
      } ${data.first_name[0].toUpperCase()}. ${data.patronymic[0].toUpperCase()}.`;

      this.tableData = [
        {
          id: this.getUserInfo.rid,
          name,
        },
      ]
        .map((item) => {
          const obj = {};
          for (const data of journalsData) {
            if (
              data.id_subject == this.activeSubject.id &&
              data.id_student == item.id
            ) {
              obj[data.date] = data.grade;
            }
          }

          return {
            id: item.id,
            name: item.name,
            ...obj,
          };
        })
        .map((item) => {
          Object.keys(item).forEach((element) => {
            if (!item[element]) {
              delete item[element];
            }
          });

          return item;
        });

      this.tableColumns = Object.keys(this.tableData[0])
        .filter(
          (item) =>
            item !== "id" && item !== "name" && !item.includes("-id_journal")
        )
        .map((item) => {
          return {
            label: item,
          };
        });

      this.tableData.forEach((i) => {
        this.tableColumns.forEach((j) => {
          if (i[j.label] == undefined) {
            i[j.label] = "";
          }
        });
      });

      this.isLoading = false;
    },
    async setFilter() {
      await this.$router.push(`/`);
    },
    async setGroup({ id }) {
      const { data } = await this.$axios.get(
        `${import.meta.env.VITE_API_URL}/students_groups?id_group=${id}`
      );
      this.activeGroup = true;
      this.tableData = data.map((item) => {
        return {
          ...item,
        };
      });
    },
    async remove(label) {
      this.tableColumns = this.tableColumns.filter(
        (item) => item.label !== label
      );
      this.tableData.forEach(async (item) => {
        this.removeList.push(item[`${label}-id_journal`]);
        if (item[label]) {
          delete item[label];
          delete item[`${label}-id_journal`];
        }
      });
    },
    add() {
      this.tableColumns.push({
        label: "",
      });
    },
    async saveColumn({ label, old }) {
      if (!old.label) {
        this.tableColumns = this.tableColumns.filter(
          (item) => item.label !== ""
        );
        this.tableColumns.push({ label });

        this.tableData.forEach((item) => {
          item[label] = "";
        });
        return;
      }
      if (old.label !== label) {
        this.tableData.forEach(async (item) => {
          const oldDate = old.label;
          await JournalsService.editData({
            id: item[`${oldDate}-id_journal`],
            grade: item[oldDate],
            date: label,
            type: "",
            id_student: item.id,
            id_subject: this.activeSubject.id,
          });
          item[`${label}-id_journal`] = item[`${oldDate}-id_journal`];
          item[label] = item[oldDate];
          delete item[oldDate];
          delete item[`${oldDate}-id_journal`];
        });
        this.tableColumns = this.tableColumns.filter(
          (item) => item.label !== old.label
        );
        this.tableColumns.push({ label });
      }
    },
    async save() {
      this.isLoading = true;
      if (this.removeList.length) {
        this.removeList.forEach(async (id) => {
          await JournalsService.removeData(id);
        });
      }

      await this.tableData.forEach(async (item) => {
        Object.keys(item)
          .filter((i) => i !== "id" && i !== "name")
          .forEach(async (data) => {
            if (this.removeList.filter((k) => k === item[data]).length) return;
            if (data.includes("-id_journal")) {
              const date = data.replace("-id_journal", "");
              await JournalsService.editData({
                id: item[data],
                grade: item[date],
                date,
                type: "",
                id_student: item.id,
                id_subject: this.activeSubject.id,
              });
            } else if (!item[`${data}-id_journal`]) {
              await JournalsService.addData({
                grade: item[data],
                date: data,
                type: "",
                id_student: item.id,
                id_subject: this.activeSubject.id,
              });
            }
          });
      });

      this.removeList = [];
      //   await this.getData();
      this.isLoading = false;
    },
  },
};
</script>
