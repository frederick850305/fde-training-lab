<template>
  <div class="vehicle-archive-edit">
    <div class="form-header">
      <button class="back-btn" @click="goBack">← 返回列表</button>
      <h3>{{ isEdit ? '编辑车辆档案' : '新增车辆档案' }}</h3>
    </div>

    <div class="form-card">
      <div class="form-group"><label>车牌号 *</label><input v-model="form.plate" placeholder="如：沪A-2601" /></div>
      <div class="form-group"><label>车辆类型 *</label>
        <select v-model="form.vehicleType"><option>平板运输车</option><option>厢式货车</option><option>重型卡车</option><option>搅拌车</option><option>吊车</option></select>
      </div>
      <div class="form-group"><label>所属单位</label><input v-model="form.unit" placeholder="如：HG物流公司" /></div>
      <div class="form-group"><label>司机姓名</label><input v-model="form.driverName" placeholder="如：李师傅" /></div>
      <div class="form-group"><label>司机电话</label><input v-model="form.driverPhone" placeholder="如：138-0001-0011" /></div>
      <div class="form-row">
        <div class="form-group"><label>年检有效期</label><input v-model="form.annualCheckExpiry" type="date" /></div>
        <div class="form-group"><label>保险有效期</label><input v-model="form.insuranceExpiry" type="date" /></div>
      </div>
      <div class="form-group"><label>证照照片</label>
        <FileUpload :fileList="certPhotos" @update:fileList="certPhotos = $event" />
      </div>
    </div>

    <div class="form-actions">
      <button class="cancel-btn" @click="goBack">取消</button>
      <button class="save-btn" @click="save" :disabled="saving">{{ saving ? '保存中...' : '💾 保存' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from '../routerShim.js'
import FileUpload from '../components/FileUpload.vue'

const router = useRouter()
const isEdit = ref(false)
const saving = ref(false)
const certPhotos = ref([])
const form = ref({
  plate: '', vehicleType: '平板运输车', unit: 'HG物流公司',
  driverName: '', driverPhone: '',
  annualCheckExpiry: '', insuranceExpiry: '',
})

function goBack() { router.push('/management/vehicle-archive') }
function save() {
  if (!form.value.plate) { alert('请输入车牌号'); return }
  saving.value = true
  setTimeout(() => {
    alert('车辆档案保存成功！')
    saving.value = false
    router.push('/management/vehicle-archive')
  }, 600)
}
</script>

<style scoped>
.vehicle-archive-edit { padding: 16px; max-width: 600px; margin: 0 auto; }
.form-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.form-header h3 { margin: 0; font-size: 16px; }
.back-btn { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 7px; background: #fff; cursor: pointer; font-size: 13px; }
.form-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: grid; gap: 14px; }
.form-group { display: grid; gap: 4px; }
.form-group label { font-size: 12px; color: #64748b; font-weight: 600; }
.form-group input, .form-group select { padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
.cancel-btn { padding: 10px 24px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; font-size: 13px; cursor: pointer; }
.save-btn { padding: 10px 24px; border: none; border-radius: 10px; background: #1a56db; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; }
.save-btn:disabled { opacity: .6; }
</style>
