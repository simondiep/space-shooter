import { createProjectile } from "./persistent-entities.js";

export function shoot(entity, addProjectileFunction) {
  switch (entity.shotType) {
    case "overlap":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(createProjectile(entity));
      }
      break;
    case "ball":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(
          createProjectile(entity, {
            vx: entity.projectileSpeed / 2,
            size: entity.projectileSize * 4,
          }),
        );
      }
      break;
    case "burst":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(
          createProjectile(entity, {
            x: entity.x + i * entity.projectileSize * 2,
          }),
        );
      }
      break;
    case "spread":
      shootSpread(entity, addProjectileFunction);
      break;
    case "side":
      for (let i = 0; i < entity.numberOfProjectiles; i++) {
        addProjectileFunction(
          createProjectile(entity, {
            x: entity.x + (i * entity.size) / 2,
            vx: 0,
            vy: -entity.projectileSpeed,
          }),
        );
        addProjectileFunction(
          createProjectile(entity, {
            x: entity.x + (i * entity.size) / 2,
            vx: 0,
            vy: entity.projectileSpeed,
          }),
        );
      }
      break;
    default:
      shootStandard(entity, addProjectileFunction);
  }
}

function shootStandard(entity, addProjectileFunction) {
  if (entity.numberOfProjectiles % 2 === 0) {
    for (let i = 1; i <= entity.numberOfProjectiles / 2; i++) {
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - (entity.size * i) / (entity.numberOfProjectiles / 2 + 1),
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + (entity.size * i) / (entity.numberOfProjectiles / 2 + 1),
        }),
      );
    }
    // 2 : 1/2
    // 4 : 1/3, 2/3
    // 6 : 1/4, 2/4, 3/4
    // 8 : 1/5, 2/5, 3/5, 4/5
  } else {
    // 1
    // 3 : 1/2
    // 5 : 1/3, 2/3
    // 7 : 1/4, 2/4, 3/4
    // 9 : 1/5, 2/5, 3/5, 4/5
    addProjectileFunction(createProjectile(entity));
    for (let i = 1; i <= (entity.numberOfProjectiles - 1) / 2; i++) {
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - (entity.size * i) / ((entity.numberOfProjectiles + 1) / 2),
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + (entity.size * i) / ((entity.numberOfProjectiles + 1) / 2),
        }),
      );
    }
  }
}

function shootSpread(entity, addProjectileFunction) {
  switch (entity.numberOfProjectiles) {
    case 1:
      addProjectileFunction(createProjectile(entity));
      break;
    case 2:
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 12,
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 12,
        }),
      );
      break;
    case 3:
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(createProjectile(entity));
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 8,
        }),
      );
      break;
    case 4:
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - entity.size / 4,
          vy: -entity.projectileSpeed / 12,
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + entity.size / 4,
          vy: entity.projectileSpeed / 12,
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 8,
        }),
      );
      break;
    case 5:
    default:
      // TODO
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - entity.size / 2,
          vy: -entity.projectileSpeed / 4,
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y - entity.size / 4,
          vy: -entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(createProjectile(entity));
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + entity.size / 4,
          vy: entity.projectileSpeed / 8,
        }),
      );
      addProjectileFunction(
        createProjectile(entity, {
          y: entity.y + entity.size / 2,
          vy: entity.projectileSpeed / 4,
        }),
      );
      break;
  }
}
