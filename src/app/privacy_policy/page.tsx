import React from "react";
import { montserrat } from "../fonts";
import { evolventa } from "../fonts";
import PageLayout from "../components/PageLayout";

const PrivacyPolicy = () => {
  return (
    <PageLayout
      title="Política de Privacidad"
      description="Información sobre el tratamiento y protección de datos personales"
      breadcrumbText="volver"
      breadcrumbLink="/"
      showBreadcrumb={true}
    >
      <div className={`flex flex-col md:gap-y-[4.44vh] gap-y-[40px] text-sm leading-5 md:text-[1.48vh] md:leading-[2.22vh] font-medium text-[#1B1743] ${montserrat.className}`}>
        <div>
          <h1 className={`pb-2 text-2xl leading-[26px] md:pb-[1.48vh] md:text-[3.33vh] md:leading-[3.51vh] font-bold ${evolventa.className}`}>
            Política de Privacidad y Tratamiento de Datos Personales
          </h1>
          <p className="pb-4 md:pb-[2.22vh]">
            Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que nos proporciona a través de nuestro sitio web.
          </p>
          <p>
            El responsable del tratamiento de datos personales es Estudio Rampazzo. Los términos utilizados en esta Política tienen el mismo significado que en la Ley de Protección de Datos Personales.
          </p>
        </div>
        
        <div>
          <p className="text-base leading-[22px] pb-4 md:pb-[1.11vh] md:text-[1.66vh] font-bold">
            Recopilación y uso de información
          </p>
          <p>
            Recopilamos datos personales (su nombre, número de teléfono, dirección de correo electrónico) solo con su consentimiento y con el propósito de proporcionar acceso a servicios e información contenida en el sitio web, así como para comunicación. Utilizamos esta información exclusivamente para procesar su solicitud de contacto y comunicación con usted.
            <br /> Procesamos datos personales solo en caso de que sean enviados por usted a través de formularios especiales ubicados en el sitio web. Al completar y enviar estos formularios, usted expresa su consentimiento para el procesamiento de datos personales de acuerdo con esta Política.
          </p>
        </div>
        
        <div>
          <p className="text-base leading-[22px] pb-4 md:pb-[1.11vh] md:text-[1.66vh] font-bold">
            Procedimiento de procesamiento de datos personales
          </p>
          <p>
            La seguridad de los datos personales que procesamos se garantiza mediante la implementación de un conjunto de medidas necesarias para cumplir con los requisitos de la legislación vigente sobre datos personales. Garantizamos la confidencialidad de los datos personales y tomamos todas las medidas posibles para excluir el acceso no autorizado a ellos por parte de terceros. Sus datos personales nunca serán transferidos a terceros, excepto en los casos previstos por la legislación vigente. En caso de detectar inexactitudes en los datos personales, puede actualizarlos enviando una notificación a la dirección de correo electrónico indicada en el sitio web. También tiene derecho a solicitar información sobre los datos personales que procesamos. El período de procesamiento de datos personales es ilimitado, pero puede revocar su consentimiento para el procesamiento de datos personales en cualquier momento enviando la notificación correspondiente al correo electrónico indicado en el sitio web, en cuyo caso los datos personales están sujetos a destrucción.
          </p>
        </div>
        
        <div>
          <p className="text-base leading-[22px] pb-4 md:pb-[1.11vh] md:text-[1.66vh] font-bold">
            Cookies y análisis
          </p>
          <p>
            Nuestro sitio web puede utilizar tecnologías como cookies para recopilar y procesar información anónima sobre los visitantes sin proporcionar la información correspondiente por parte de los usuarios con el objetivo de mejorar la calidad del sitio web y su contenido. Puede deshabilitar el uso de cookies en la configuración de su navegador.
          </p>
        </div>
        
        <div>
          <p className="text-base leading-[22px] pb-4 md:pb-[1.11vh] md:text-[1.66vh] font-bold">
            Cambios en la Política
          </p>
          <p>
            Nos reservamos el derecho de realizar cambios en esta Política. Cualquier cambio será publicado en esta página y la fecha de la última actualización será modificada.
          </p>
        </div>
        
        <div>
          <p className="text-base leading-[22px] pb-4 md:pb-[1.11vh] md:text-[1.66vh] font-bold">
            Información de contacto
          </p>
          <p className="pb-4 md:pb-[1.11vh]">
            Si tiene preguntas o comentarios sobre esta Política, <br className="hidden md:block"/>
            contáctenos de una de las siguientes maneras:
          </p>
          <p>
                         Correo electrónico: estudiorampazzofernando@gmail.com <br />
            Teléfono: +54 9 11 2191-4149
          </p>
        </div>
        
        <div>
          <p className="text-base leading-[22px] pb-4 md:pb-[1.11vh] md:text-[1.66vh] font-bold">
            Disposiciones finales:
          </p>
          <p>
            Al aceptar los términos de esta Política, confirma que conoce sus derechos y obligaciones previstos por la legislación vigente de la República Argentina sobre datos personales, en particular, el derecho de acceso a sus datos personales y de revocar su consentimiento. Si no tiene la intención de proporcionar datos personales o no acepta los términos de esta Política, debe dejar de usar el sitio web, en cuyo caso no podremos garantizarle el uso del sitio web.
          </p>
        </div>
        
        <p className="text-[#807D9B]">Fecha de última modificación: 22.01.2024</p>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
