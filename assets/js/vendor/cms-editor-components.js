/*
 * vendor/cms-editor-components.js — registra dois "blocos especiais"
 * que aparecem no editor do CMS (admin/index.html): vídeo do YouTube e
 * caixa de destaque. Isso PRECISA ser JavaScript (o Decap CMS não
 * aceita registrar isso em YAML) e precisa rodar depois que a biblioteca
 * do CMS (decap-cms.js) já carregou — por isso este arquivo é referenciado
 * só em admin/index.html, sem "defer", logo depois do script do CMS.
 */
CMS.registerEditorComponent({
  id: 'youtube',
  label: '🎬 Vídeo do YouTube',
  fields: [
    { name: 'id', label: 'ID do vídeo (o que vem depois de watch?v= no link)', widget: 'string' }
  ],
  pattern: /^<div class="video-embed">\s*<iframe src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"[^>]*><\/iframe>\s*<\/div>$/,
  fromBlock: function (match) { return { id: match[1] }; },
  toBlock: function (obj) {
    return '<div class="video-embed">\n  <iframe src="https://www.youtube.com/embed/' + obj.id + '" allowfullscreen></iframe>\n</div>';
  },
  toPreview: function (obj) { return '🎬 Vídeo do YouTube: ' + obj.id; }
});

CMS.registerEditorComponent({
  id: 'callout',
  label: '💡 Caixa de destaque',
  fields: [
    {
      name: 'tipo', label: 'Tipo', widget: 'select',
      options: [
        { label: 'Dica', value: 'tip' },
        { label: 'Atenção', value: 'warning' },
        { label: 'Importante', value: 'important' }
      ]
    },
    { name: 'texto', label: 'Texto', widget: 'text' }
  ],
  pattern: /^> \*\*(Dica|Atenção|Importante):\*\* ([\s\S]+)\n\{: \.callout \.callout--(tip|warning|important) \}$/,
  fromBlock: function (match) { return { tipo: match[3], texto: match[2] }; },
  toBlock: function (obj) {
    var rotulo = { tip: 'Dica', warning: 'Atenção', important: 'Importante' }[obj.tipo] || 'Dica';
    return '> **' + rotulo + ':** ' + obj.texto + '\n{: .callout .callout--' + obj.tipo + ' }';
  },
  toPreview: function (obj) { return '💡 [' + obj.tipo + '] ' + obj.texto; }
});
