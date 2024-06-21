<?php

namespace Drupal\site_image\Extension;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigExtension extends AbstractExtension {


  /**
   * @inheritdoc
   */
  public function getFunctions(): array {
    return [
      new TwigFunction('render_field', [$this, 'render_field']),
      new TwigFunction('render_responsive_image', [$this, 'render_responsive_image']),
    ];
  }

  public function render_field ($field, $displayOrOptions = 'default') {
    if ($field) {
      return $field->view($displayOrOptions);
    }
  }

  public function render_responsive_image ($imageField, $imageStyle = 'col_6') {

    return $this->render_field($imageField, [
      'label' => 'hidden',
      'settings' => [
        'responsive_image_style' => $imageStyle,
        'image_link' => ''
      ],
      'type' => 'responsive_image'
    ]);
  }

}
