"use strict";

const AWS = require("aws-sdk");
const sharp = require("sharp");
const { basename, extname } = require("path");

const S3 = new AWS.S3();

/**
 * Será disparado para cada arquivo que foi feito upload no S3
 * 
 * Caso seja feito 3 uploads ao mesmo tempo, os 3 arquivos são feitos de uma vez só.
 * Para isso, usamos o "Records". Dentro dele, teremos as três imagens.
 */
module.exports.handle = async ({ Records: records }, context) => {
  try {
    await Promise.all(
      records.map(async record => {
        console.log(">>> ", record);

        // key: Referência da imagem que está na S3
        const { key } = record.s3.object;

        // Resgatando a imagem a partir do S3
        const image = await S3.getObject({
          // Informando qual é o bucket [serverless.yml]: functions.optimize.environment.bucket
          Bucket: process.env.bucket,
          Key: key
        }).promise(); //Retornando uma promise

        /**
         * Criando a imagem já otimizada
         *  sharp: lib para trabalhar com manipulação de imagens
         *  image.Body -> pega o base64 da imagem
         *  fit: "inside" -> mantém a proporção da imagem
         */
        const optimized = await sharp(image.Body)
          .resize(1280, 720, { fit: "inside", withoutEnlargement: true })
          .toFormat("jpeg", { progressive: true, quality: 50 })
          .toBuffer();

        // Salvando a imagem novamente no S3
        await S3.putObject({
          //Conteúdo do arquivo
          Body: optimized,
          //Bucket
          Bucket: process.env.bucket,
          // Tipo do conteúdo
          ContentType: "image/jpeg",
          // Key: caminho do arquivo (se salvarmos na mesma key, o lambda vai entrar em looping)
          // Para pegar o nome da imagem no S3: basename(key, extname(key))
          //  extname(key) -> extensão da imagem original
          // Ficaria exemplo: "compressed/imagem_no_s3.png.jpeg" 
          Key: `compressed/${basename(key, extname(key))}.jpg`
        }).promise();
      })
    );

    // Se deu tudo certo
    return {
      // 301: Criado
      statusCode: 301,
      body: { ok: true }
    };
  } catch (err) {
    return err;
  }
};
