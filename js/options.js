browser.storage.local.get(['TW_BASEURL', 'TW_API_KEY'])
.then(config => {
  $('#configure-tw-form').find('#tw-base-url').val(config['TW_BASEURL']) 
  $('#configure-tw-form').find('#tw-api-key').val(config['TW_API_KEY']) 
})

$('#save-config-confirm').on('click', (e) => {
  let TW_BASEURL = $('#configure-tw-form').find('#tw-base-url').val() 
  let TW_API_KEY = $('#configure-tw-form').find('#tw-api-key').val() 
  let TW_API_KEY_BASE64 = btoa(TW_API_KEY + ":xxx");
  browser.storage.local.set({TW_BASEURL, TW_API_KEY, TW_API_KEY_BASE64});
})