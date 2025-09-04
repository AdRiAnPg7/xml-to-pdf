export type TemplateDef = {
  id: string;
  name: string;
  xslt: string;
  css: string;
};

const PRINT_FIX = `
@media print {
  @page { size: A4; margin: 0; }
  .page { width:210mm; min-height:auto !important; margin:0; box-shadow:none !important; }
}
`;

/* =============== 1) BASICA =============== */
export const BASE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sii="http://www.sii.cl/SiiDte"
  exclude-result-prefixes="sii">
  <xsl:output method="html" omit-xml-declaration="yes"/>
  <!-- Usa /logo.png por defecto si no viene nada -->
  <xsl:param name="logoUrl" select="'/logo.png'"/>
  <xsl:param name="barcodeDataUrl"/>
  <xsl:variable name="doc" select="//sii:DTE/sii:Documento"/>

  <xsl:template match="/">
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Factura</title>
      </head>
      <body>
        <div class="page"><div class="page-inner">

          <div class="hdr-grid">
            <div class="emisor-box">

              <!-- LOGO (opcional) -->
              <xsl:if test="string-length($logoUrl) &gt; 0">
                <div class="emisor-logo">
                  <img class="logo" src="{$logoUrl}" alt="Logo"/>
                </div>
              </xsl:if>

              <div class="emisor-razon"><xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:RznSoc"/></div>
              <div class="emisor-line">Giro: <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:GiroEmis"/></div>
              <div class="emisor-line">PC RESTO LT C P 1 - <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:CmnaOrigen"/></div>
              <div class="emisor-line">eMail : <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:CorreoEmisor"/></div>
              <div class="emisor-line">TIPO DE VENTA: DEL GIRO</div>
            </div>

            <div class="folio-box">
              <div class="rut">R.U.T.: <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:RUTEmisor"/></div>
              <div class="title">FACTURA ELECTRONICA</div>
              <div class="folio">N° <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:Folio"/></div>
            </div>
          </div>

          <div class="sii-line">
            S.I.I. - <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:CiudadOrigen"/>
          </div>

          <div class="grid-3">
            <div class="receptor-box">
              <div class="box-title">SEÑOR(ES):</div>
              <div class="row"><label>R.U.T.:</label><span><xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:RUTRecep"/></span></div>
              <div class="row"><label>GIRO:</label><span><xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:GiroRecep"/></span></div>
              <div class="row"><label>DIRECCION:</label><span><xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:DirRecep"/></span></div>
              <div class="row"><label>COMUNA</label><span><xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:CmnaRecep"/></span><label>CIUDAD:</label><span><xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:CiudadRecep"/></span></div>
              <div class="row"><label>CONTACTO:</label><span>—</span></div>
              <div class="row"><label>TIPO DE COMPRA:</label><span>DEL GIRO</span></div>
            </div>

            <div class="fecha-box">
              <div class="lbl">Fecha Emisión:</div>
              <div class="val"><xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:FchEmis"/></div>
            </div>
          </div>

          <table class="detalle">
            <thead>
              <tr>
                <th class="col-codigo">Codigo</th>
                <th>Descripcion</th>
                <th class="col-cant">Cantidad</th>
                <th class="col-precio">Precio</th>
                <th class="col-desc">%Desc.</th>
                <th class="col-valor">Valor</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="$doc/sii:Detalle">
                <tr>
                  <td></td>
                  <td>
                    <div class="desc-name"><xsl:value-of select="sii:NmbItem"/></div>
                    <div class="desc-text"><xsl:value-of select="normalize-space(sii:DscItem)"/></div>
                  </td>
                  <td class="num"><xsl:value-of select="format-number(number(sii:QtyItem), '0.###')"/></td>
                  <td class="num"><xsl:value-of select="format-number(number(sii:PrcItem), '#,##0.00')"/></td>
                  <td class="num">0</td>
                  <td class="num"><xsl:value-of select="format-number(number(sii:MontoItem), '#,##0')"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="refs-pagos">
            <div class="refs">
              <div class="refs-title">Referencias:</div>
              <ul>
                <xsl:for-each select="$doc/sii:Referencia">
                  <li>
                    - <xsl:value-of select="concat('Orden/Doc N° ', sii:FolioRef, ' del ', sii:FchRef)"/>
                  </li>
                </xsl:for-each>
              </ul>
              <div class="pagos">
                <div>Pagos:</div>
                <div class="row">
                  <span><xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:MntPagos/sii:FchPago"/></span>
                  <span>$ <xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:IdDoc/sii:MntPagos/sii:MntPago), '#,##0')"/></span>
                </div>
                <div>Forma de Pago:
                  <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:FmaPago"/>
                </div>
              </div>
            </div>

            <div class="totales-box">
              <div class="r"><span>MONTO NETO</span><b>$ <xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:Totales/sii:MntNeto), '#,##0')"/></b></div>
              <div class="r"><span>I.V.A. <xsl:value-of select="$doc/sii:Encabezado/sii:Totales/sii:TasaIVA"/>%</span><b>$ <xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:Totales/sii:IVA), '#,##0')"/></b></div>
              <div class="r"><span>IMPUESTO ADICIONAL</span><b>$ 0</b></div>
              <div class="r total"><span>TOTAL</span><b>$ <xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:Totales/sii:MntTotal), '#,##0')"/></b></div>
            </div>
          </div>

          <div class="timbre-area">
            <xsl:if test="string-length($barcodeDataUrl) &gt; 0">
              <img class="pdf417" src="{$barcodeDataUrl}" alt="Timbre"/>
              <div class="timbre-note">
                Timbre Electrónico SII<br/>
                Res. 99 de 2014 Verifique documento: www.sii.cl
              </div>
            </xsl:if>
          </div>

        </div></div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export const BASE_CSS = `
.page{width:210mm;margin:0 auto;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.page-inner{padding:10mm 12mm;font-family:Arial, Helvetica, sans-serif;color:#111}
.hdr-grid{display:grid;grid-template-columns:2fr 1fr;gap:12px}
.emisor-box{border:1px solid #6b83d6;padding:8px 10px}
.emisor-logo{display:flex;align-items:center;margin-bottom:6px}
.logo{height:46px;max-width:200px;object-fit:contain}
.emisor-razon{font-weight:700;color:#c00;letter-spacing:.2px}
.emisor-line{font-size:12px;color:#1f3a8a}
.folio-box{border:3px solid #e11; padding:8px 10px; text-align:center}
.folio-box .rut{font-weight:700;color:#bf0000}
.folio-box .title{font-weight:700;color:#bf0000;margin:4px 0}
.folio-box .folio{font-weight:700;color:#bf0000;font-size:18px}
.sii-line{color:#bf0000;font-weight:700;margin:6px 0 8px 0}
.grid-3{display:grid;grid-template-columns:3fr 1fr;gap:8px;margin-bottom:6px}
.receptor-box{border:1px solid #6b83d6;padding:8px}
.receptor-box .box-title{font-weight:700;margin-bottom:4px;color:#1f3a8a}
.receptor-box .row{display:flex;gap:6px;font-size:12px;flex-wrap:wrap}
.receptor-box label{min-width:80px;color:#1f3a8a}
.fecha-box{border:1px solid #6b83d6;padding:8px}
.fecha-box .lbl{color:#1f3a8a}
.detalle{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}
.detalle th,.detalle td{border:1px solid #6b83d6;padding:6px 8px;vertical-align:top}
.detalle thead th{background:#eef2ff}
.col-codigo{width:60px}.col-cant{width:80px;text-align:right}.col-precio{width:90px;text-align:right}.col-desc{width:70px;text-align:right}.col-valor{width:110px;text-align:right}
.desc-name{font-weight:600}
.desc-text{white-space:pre-wrap}
.num{text-align:right}
.refs-pagos{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-top:8px}
.refs-title{font-weight:600;color:#1f3a8a}
.refs ul{margin:4px 0 6px 0;padding-left:16px}
.pagos .row{display:flex;justify-content:space-between;width:220px}
.totales-box{border:1px solid #6b83d6}
.totales-box .r{display:flex;justify-content:space-between;padding:6px 10px;border-bottom:1px solid #6b83d6}
.totales-box .r:last-child{border-bottom:none}
.totales-box .total{background:#fff7d6;font-weight:700}
.timbre-area{display:flex;gap:14px;align-items:center;margin-top:10px}
.pdf417{height:110px}
.timbre-note{font-size:11px;color:#333}
@media print{
  @page{size:A4;margin:0}
  .page{width:210mm;margin:0;box-shadow:none}
}
`;


/* =============== 2) CLASICA =============== */

const CLASSIC_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sii="http://www.sii.cl/SiiDte"
  exclude-result-prefixes="sii">
  <xsl:output method="html" omit-xml-declaration="yes" />
  <xsl:param name="logoUrl" select="'/logo.png'"/>
  <xsl:param name="barcodeDataUrl"/>
  <xsl:variable name="doc" select="//sii:DTE/sii:Documento"/>
  <xsl:template match="/">
    <html><head><meta charset="utf-8"/><title>Factura</title></head>
    <body>
      <div class="page"><div class="page-inner">

        <header class="inv-header">
          <div class="brand">
            <xsl:if test="string-length($logoUrl) &gt; 0">
              <img class="logo" src="{$logoUrl}" alt="Logo"/>
            </xsl:if>
            <div>
              <div class="brand-title"><xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:RznSoc"/></div>
              <div class="brand-sub">RUT: <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:RUTEmisor"/></div>
              <div class="brand-sub">Giro: <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:GiroEmis"/></div>
              <div class="brand-sub">Sucursal: <xsl:value-of select="$doc/sii:Encabezado/sii:Emisor/sii:CdgSIISucur"/></div>
            </div>
          </div>
          <div class="inv-meta">
            <div class="inv-type">FACTURA ELECTRÓNICA (Tipo <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:TipoDTE"/>)</div>
            <div class="inv-folio">Folio: <span class="folio"><xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:Folio"/></span></div>
            <div>Fecha emisión: <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:FchEmis"/></div>
          </div>
        </header>

        <section class="grid two">
          <div class="card">
            <div class="card-title">Receptor</div>
            <div><b>Razón social:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:RznSocRecep"/></div>
            <div><b>RUT:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:RUTRecep"/></div>
            <div><b>Giro:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:GiroRecep"/></div>
            <div><b>Dirección:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:DirRecep"/></div>
            <div><b>Comuna/Ciudad:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:CmnaRecep"/> / <xsl:value-of select="$doc/sii:Encabezado/sii:Receptor/sii:CiudadRecep"/></div>
          </div>
          <div class="card">
            <div class="card-title">Condiciones</div>
            <div><b>Forma de pago:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:FmaPago"/></div>
            <div><b>Transacción (Compra/Venta):</b> <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:TpoTranCompra"/> / <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:TpoTranVenta"/></div>
            <div><b>Monto pago / Fecha:</b> <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:MntPagos/sii:MntPago"/> — <xsl:value-of select="$doc/sii:Encabezado/sii:IdDoc/sii:MntPagos/sii:FchPago"/></div>
          </div>
        </section>

        <section class="card mt">
          <div class="card-title">Detalle</div>
          <table class="tbl">
            <thead>
              <tr><th>#</th><th>Ítem</th><th>Descripción</th><th class="num">Cant.</th><th>UM</th><th class="num">Precio</th><th class="num">Monto</th></tr>
            </thead>
            <tbody>
              <xsl:for-each select="$doc/sii:Detalle">
                <tr>
                  <td><xsl:value-of select="sii:NroLinDet"/></td>
                  <td><xsl:value-of select="sii:NmbItem"/></td>
                  <td><xsl:value-of select="normalize-space(sii:DscItem)"/></td>
                  <td class="num"><xsl:value-of select="format-number(number(sii:QtyItem), '0.###')"/></td>
                  <td><xsl:value-of select="sii:UnmdItem"/></td>
                  <td class="num"><xsl:value-of select="format-number(number(sii:PrcItem), '#,##0.00')"/></td>
                  <td class="num"><xsl:value-of select="format-number(number(sii:MontoItem), '#,##0')"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </section>

        <xsl:if test="$doc/sii:Referencia">
          <section class="card mt">
            <div class="card-title">Referencias</div>
            <table class="tbl">
              <thead><tr><th>#</th><th>Tipo</th><th>Folio</th><th>Fecha</th></tr></thead>
              <tbody>
                <xsl:for-each select="$doc/sii:Referencia">
                  <tr>
                    <td><xsl:value-of select="sii:NroLinRef"/></td>
                    <td><xsl:value-of select="sii:TpoDocRef"/></td>
                    <td><xsl:value-of select="sii:FolioRef"/></td>
                    <td><xsl:value-of select="sii:FchRef"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </section>
        </xsl:if>

        <section class="totals">
          <div class="totals-row"><span>Neto</span><span class="num"><xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:Totales/sii:MntNeto), '#,##0')"/></span></div>
          <div class="totals-row"><span>IVA (<xsl:value-of select="$doc/sii:Encabezado/sii:Totales/sii:TasaIVA"/>%)</span><span class="num"><xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:Totales/sii:IVA), '#,##0')"/></span></div>
          <div class="totals-row grand"><span>Total</span><span class="num"><xsl:value-of select="format-number(number($doc/sii:Encabezado/sii:Totales/sii:MntTotal), '#,##0')"/></span></div>
        </section>

        <section class="timbre">
          <xsl:if test="string-length($barcodeDataUrl) &gt; 0">
            <img class="pdf417" src="{$barcodeDataUrl}" alt="Timbre Electrónico SII"/>
            <div class="timbre-note">Timbre Electrónico SII<br/>Res. 99 de 2014 Verifique documento: www.sii.cl</div>
          </xsl:if>
        </section>

      </div></div>
    </body></html>
  </xsl:template>
</xsl:stylesheet>
`;

const CLASSIC_CSS = `
.page{width:210mm;margin:0 auto;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.page-inner{padding:16mm;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111827}
.brand{display:flex;gap:12px;align-items:center}
.logo{height:60px;max-width:180px;object-fit:contain;margin-bottom:8px}
.inv-header{display:grid;grid-template-columns:2fr 1fr;gap:16px;align-items:start;margin:0 0 16px 0}
.brand-title{font-size:20px;font-weight:700;color:#0f766e}.brand-sub{font-size:12px;color:#374151}
.inv-meta{text-align:right;font-size:12px}.inv-type{font-weight:600}.inv-folio{font-size:16px;font-weight:700}.folio{color:#b91c1c}
.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;background:#fff}
.card-title{font-weight:600;margin-bottom:6px;color:#111827}.mt{margin-top:12px}
.tbl{width:100%;border-collapse:collapse;font-size:12px}.tbl th,.tbl td{border:1px solid #e5e7eb;padding:6px 8px;vertical-align:top}.tbl th{background:#f9fafb;text-align:left}.num{text-align:right}
.totals{margin-top:14px;width:280px;margin-left:auto}.totals-row{display:flex;justify-content:space-between;padding:6px 8px;border:1px solid #e5e7eb;border-bottom:none}.totals-row:last-child{border-bottom:1px solid #e5e7eb}.totals-row.grand{background:#fef3c7;font-weight:700}
.timbre{display:flex;gap:12px;align-items:center;margin-top:14px}
.pdf417{height:110px}
.timbre-note{font-size:10px;color:#374151}
${PRINT_FIX}
`;

/* =============== 3) COMPACTA =============== */

const COMPACT_XSLT = CLASSIC_XSLT.replace(
  '<header class="inv-header">',
  '<header class="inv-header compact">'
);
const COMPACT_CSS = `
.page{width:210mm;margin:0 auto;background:#fff}
.page-inner{padding:10mm;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111827}
.brand{display:flex;gap:10px;align-items:center}
.logo{height:40px;max-width:150px;object-fit:contain}
.inv-header{display:grid;grid-template-columns:2fr 1fr;gap:10px;align-items:start;margin-bottom:10px}
.brand-title{font-size:16px;font-weight:700;color:#0ea5e9}.brand-sub{font-size:11px;color:#475569}
.inv-meta{text-align:right;font-size:11px}.inv-type{font-weight:600}.inv-folio{font-size:14px;font-weight:800}.folio{color:#b91c1c}
.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.card{border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;background:#fff}
.card-title{font-weight:700;margin-bottom:4px;color:#0f172a}.mt{margin-top:8px}
.tbl{width:100%;border-collapse:collapse;font-size:11px}.tbl th,.tbl td{border:1px solid #e2e8f0;padding:5px 6px;vertical-align:top}.tbl th{background:#f8fafc}.num{text-align:right}
.totals{margin-top:10px;width:240px;margin-left:auto}.totals-row{display:flex;justify-content:space-between;padding:5px 6px;border:1px solid #e2e8f0;border-bottom:none}.totals-row:last-child{border-bottom:1px solid #e2e8f0}.totals-row.grand{background:#fff7ed;font-weight:800}
.timbre{display:flex;gap:10px;align-items:center;margin-top:10px}
.pdf417{height:96px}
.timbre-note{font-size:10px;color:#475569}
${PRINT_FIX}
`;

/* =============== 4) MINIMAL =============== */

const MINIMAL_XSLT = CLASSIC_XSLT.replace('class="tbl"', 'class="tbl minimal"');
const MINIMAL_CSS = `
.page{width:210mm;margin:0 auto;background:#fff}
.page-inner{padding:18mm 16mm;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a}
.brand{display:flex;gap:12px;align-items:center}
.logo{height:44px;max-width:180px;object-fit:contain}
.inv-header{display:grid;grid-template-columns:2fr 1fr;gap:14px;align-items:start;margin-bottom:10px}
.brand-title{font-size:22px;font-weight:800;color:#065f46}.brand-sub{font-size:12px;color:#374151}
.inv-meta{text-align:right;font-size:12px}.inv-type{font-weight:700;color:#334155}.inv-folio{font-size:18px;font-weight:900}.folio{color:#991b1b}
.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{background:#fff;border-radius:10px;padding:8px 0}
.card-title{font-weight:700;margin-bottom:6px}
.tbl{width:100%;border-collapse:separate;border-spacing:0 4px;font-size:12px}
.tbl thead th{font-weight:700;text-align:left;border-bottom:2px solid #e5e7eb;padding:6px 8px}
.tbl tbody td{padding:6px 8px;background:#fafafa}
.tbl tbody tr:nth-child(even) td{background:#f3f4f6}
.num{text-align:right}
.totals{margin-top:10px;width:280px;margin-left:auto}
.totals-row{display:flex;justify-content:space-between;padding:8px 10px;background:#f9fafb;border-radius:8px;margin-bottom:6px}
.totals-row.grand{background:#fffbeb;font-weight:900}
.timbre{display:flex;gap:12px;align-items:center;margin-top:12px}
.pdf417{height:110px}
.timbre-note{font-size:10px;color:#64748b}
${PRINT_FIX}
`;

/* =============== 5) BORDE FUERTE =============== */

const BORDERED_XSLT = CLASSIC_XSLT.replace(
  'class="inv-header"',
  'class="inv-header bordered"'
);
const BORDERED_CSS = `
.page{width:210mm;margin:0 auto;background:#fff;box-shadow:0 0 0 2px #1f2937 inset}
.page-inner{padding:14mm;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111827}
.brand{display:flex;gap:12px;align-items:center}
.logo{height:44px;max-width:170px;object-fit:contain}
.inv-header{display:grid;grid-template-columns:2fr 1fr;gap:16px;align-items:start;margin-bottom:12px;border-bottom:2px solid #1f2937;padding-bottom:8px}
.brand-title{font-size:20px;font-weight:900;color:#111827}.brand-sub{font-size:12px;color:#1f2937}
.inv-meta{text-align:right;font-size:12px}.inv-type{font-weight:800}.inv-folio{font-size:18px;font-weight:900}.folio{color:#b91c1c}
.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{border:2px solid #1f2937;border-radius:6px;padding:10px;background:#fff}
.card-title{font-weight:900;margin-bottom:6px;color:#111827}.mt{margin-top:10px}
.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th,.tbl td{border:1px solid #1f2937;padding:6px 8px;vertical-align:top}
.tbl th{background:#111827;color:#fff;text-align:left}
.num{text-align:right}
.totals{margin-top:12px;width:280px;margin-left:auto}
.totals-row{display:flex;justify-content:space-between;padding:8px;border:2px solid #1f2937;border-bottom:none}
.totals-row:last-child{border-bottom:2px solid #1f2937}
.totals-row.grand{background:#fde68a;font-weight:900}
.timbre{display:flex;gap:12px;align-items:center;margin-top:12px}
.pdf417{height:110px}
.timbre-note{font-size:10px}
${PRINT_FIX}
`;

/* =============== 6) AZUL =============== */

const BLUE_XSLT = CLASSIC_XSLT.replace('class="card"', 'class="card blue"');
const BLUE_CSS = `
.page{width:210mm;margin:0 auto;background:#fff}
.page-inner{padding:16mm;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a}
.brand{display:flex;gap:12px;align-items:center}
.logo{height:42px;max-width:170px;object-fit:contain}
.inv-header{display:grid;grid-template-columns:2fr 1fr;gap:16px;align-items:start;margin-bottom:14px}
.brand-title{font-size:22px;font-weight:900;color:#1e40af}.brand-sub{font-size:12px;color:#334155}
.inv-meta{text-align:right;font-size:12px}.inv-type{font-weight:700;color:#1e3a8a}.inv-folio{font-size:18px;font-weight:900}.folio{color:#b91c1c}
.grid.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{border:1px solid #dbeafe;border-radius:10px;padding:10px;background:#eff6ff}
.card.blue .card-title{color:#1e3a8a}
.card-title{font-weight:800;margin-bottom:6px}
.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th,.tbl td{border:1px solid #dbeafe;padding:6px 8px;vertical-align:top}
.tbl th{background:#dbeafe;color:#0f172a;text-align:left}
.num{text-align:right}
.totals{margin-top:14px;width:300px;margin-left:auto}
.totals-row{display:flex;justify-content:space-between;padding:8px 10px;border:1px solid #dbeafe;background:#eff6ff;border-bottom:none}
.totals-row:last-child{border-bottom:1px solid #dbeafe}
.totals-row.grand{background:#fde68a;font-weight:900}
.timbre{display:flex;gap:12px;align-items:center;margin-top:14px}
.pdf417{height:110px}
.timbre-note{font-size:10px;color:#334155}
${PRINT_FIX}
`;


export const TEMPLATES: TemplateDef[] = [
  {
    id: "base",
    name: "Basica",
    xslt: BASE_XSLT,
    css: BASE_CSS,
  },
  {
    id: "classic",
    name: "Clasica",
    xslt: CLASSIC_XSLT,
    css: CLASSIC_CSS,
  },
  {
    id: "compact",
    name: "Compacta",
    xslt: COMPACT_XSLT,
    css: COMPACT_CSS,
  },
  {
    id: "minimal",
    name: "Minimal",
    xslt: MINIMAL_XSLT,
    css: MINIMAL_CSS,
  },
  {
    id: "bordered",
    name: "Border",
    xslt: BORDERED_XSLT,
    css: BORDERED_CSS,
  },
  {
    id: "blue",
    name: "Azul",
    xslt: BLUE_XSLT,
    css: BLUE_CSS,
  },
];
